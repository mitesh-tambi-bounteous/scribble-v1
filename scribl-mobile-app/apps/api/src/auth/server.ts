import { createServer, type IncomingMessage, type ServerResponse, type Server } from "node:http";
import { randomUUID } from "node:crypto";
import { validateSignInRequest } from "../../../../packages/contracts/src/api/auth.ts";
import { ERROR_STATUS, type ErrorCode } from "../../../../packages/contracts/src/api/errors.ts";
import { signUp, confirmEmail, resendConfirmation, type AuthServiceDeps } from "./auth.service.ts";
import { SIGN_UP_RATE_LIMIT_MAX_ATTEMPTS, SIGN_UP_RATE_LIMIT_WINDOW_MS } from "./constants.ts";

/**
 * Plain `node:http` router standing in for the Nest scaffold this story's
 * plan describes: NestJS cannot be installed in this sandbox (no network
 * access to the package registry -- see the story summary). Same routes,
 * same contract, same error envelope; swapping this for a real Nest
 * controller later is a routing-layer change, not a service-layer one.
 */

// Caps in-memory body buffering so a client can't exhaust server memory by
// streaming an unbounded payload at any auth endpoint (security_review
// finding). Every auth request body is a small JSON object; 1MB is
// generous headroom over the largest legitimate body here.
const MAX_BODY_BYTES = 1_000_000;

class PayloadTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
    this.name = "PayloadTooLargeError";
  }
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = "";
    let bytes = 0;
    let settled = false;

    req.on("data", (chunk: Buffer) => {
      if (settled) return;
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        settled = true;
        // Deliberately don't destroy the request/socket here: the response
        // still needs to go out over the same connection. Once `settled`,
        // every further chunk is dropped without being appended to `raw`,
        // so memory stays bounded regardless of how much more is sent.
        reject(new PayloadTooLargeError());
        return;
      }
      raw += chunk;
    });
    req.on("end", () => {
      if (settled) return;
      settled = true;
      if (raw.length === 0) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });
  });
}

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json" });
  res.end(payload);
}

function writeError(res: ServerResponse, code: ErrorCode, message: string): void {
  writeJson(res, ERROR_STATUS[code], { code, message, correlationId: randomUUID() });
}

// AC11 requires the sign-up response to state plainly that an email is
// already registered, which is itself a (documented, accepted) enumeration
// signal -- see auth.service.ts. This per-client window caps how many
// distinct emails one client can probe, without changing what the response
// says while under the cap.
interface SignUpAttemptWindow {
  count: number;
  windowStartedAt: number;
}

function createSignUpRateLimiter() {
  const attemptsByClient = new Map<string, SignUpAttemptWindow>();
  return function isRateLimited(clientKey: string, now: number): boolean {
    const window = attemptsByClient.get(clientKey);
    if (!window || now - window.windowStartedAt > SIGN_UP_RATE_LIMIT_WINDOW_MS) {
      attemptsByClient.set(clientKey, { count: 1, windowStartedAt: now });
      return false;
    }
    window.count += 1;
    return window.count > SIGN_UP_RATE_LIMIT_MAX_ATTEMPTS;
  };
}

export function createAuthServer(deps: AuthServiceDeps): Server {
  const isSignUpRateLimited = createSignUpRateLimiter();

  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method ?? "GET";
    const path = (req.url ?? "/").split("?")[0];

    try {
      if (method === "POST" && path === "/auth/sign-up") {
        const clientKey = req.socket.remoteAddress ?? "unknown";
        if (isSignUpRateLimited(clientKey, Date.now())) {
          return writeError(res, "rate_limited", "Too many sign-up attempts. Try again later.");
        }
        const body = await readJsonBody(req);
        const result = await signUp(body, deps);
        if (result.ok) return writeJson(res, 200, result.value);
        return writeError(res, result.code, result.message);
      }

      if (method === "POST" && path === "/auth/sign-in") {
        const body = await readJsonBody(req);
        const validation = validateSignInRequest(body);
        if (!validation.ok) {
          return validation.kind === "unsupported_auth_method"
            ? writeError(res, "unsupported_auth_method", validation.message)
            : writeError(res, "validation_failed", validation.message);
        }
        const outcome = await deps.adapter.signIn(validation.value.email, validation.value.password);
        if (outcome.outcome === "authenticated") {
          return writeJson(res, 200, {
            kind: "authenticated",
            user: outcome.user,
            sessionId: outcome.sessionId,
            accessToken: outcome.accessToken,
            capabilities: { canSubmit: false, canReact: false, canInvite: false, requiresParentalConsent: false },
          });
        }
        if (outcome.outcome === "challenge") {
          return writeJson(res, 200, {
            kind: "challenge",
            challenge: { kind: outcome.kind },
            challengeToken: outcome.challengeToken,
          });
        }
        return writeError(res, "unauthenticated", "Incorrect email or password.");
      }

      if (method === "POST" && path === "/auth/challenge") {
        const body = await readJsonBody(req);
        if (
          typeof body !== "object" ||
          body === null ||
          typeof (body as Record<string, unknown>).challengeToken !== "string" ||
          typeof (body as Record<string, unknown>).kind !== "string" ||
          typeof (body as Record<string, unknown>).answer !== "string"
        ) {
          return writeError(res, "validation_failed", "challengeToken, kind and answer are required.");
        }
        const { challengeToken, kind, answer } = body as { challengeToken: string; kind: string; answer: string };
        const outcome = await deps.adapter.answerChallenge({
          challengeToken,
          kind: kind as Parameters<typeof deps.adapter.answerChallenge>[0]["kind"],
          answer,
        });
        if (outcome.outcome === "authenticated") {
          return writeJson(res, 200, {
            kind: "authenticated",
            user: outcome.user,
            sessionId: outcome.sessionId,
            accessToken: outcome.accessToken,
            capabilities: { canSubmit: false, canReact: false, canInvite: false, requiresParentalConsent: false },
          });
        }
        return writeError(res, "unauthenticated", "That challenge answer isn't valid.");
      }

      if (method === "POST" && path === "/auth/confirm-email") {
        const body = await readJsonBody(req);
        const result = await confirmEmail(body, deps);
        if (result.ok) return writeJson(res, 200, result.value);
        return writeError(res, result.code, result.message);
      }

      if (method === "POST" && path === "/auth/confirm-email/resend") {
        const body = await readJsonBody(req);
        const result = await resendConfirmation(body, deps);
        if (result.ok) return writeJson(res, 200, {});
        return writeError(res, result.code, result.message);
      }

      // No social/federated or phone-number auth surface is exposed at all
      // (AC9): every other path, including /auth/federated/* and
      // /auth/sign-up/phone, falls through to the same not_found envelope.
      return writeError(res, "not_found", "Not found.");
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        return writeError(res, "payload_too_large", error.message);
      }
      return writeError(res, "internal", "Unexpected server error.");
    }
  });
}
