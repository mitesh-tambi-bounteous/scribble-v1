import { createServer, type IncomingMessage, type ServerResponse, type Server } from "node:http";
import { randomUUID } from "node:crypto";
import { validateSignInRequest } from "../../../../packages/contracts/src/api/auth.ts";
import { ERROR_STATUS, type ErrorCode } from "../../../../packages/contracts/src/api/errors.ts";
import { signUp, confirmEmail, resendConfirmation, type AuthServiceDeps } from "./auth.service.ts";

/**
 * Plain `node:http` router standing in for the Nest scaffold this story's
 * plan describes: NestJS cannot be installed in this sandbox (no network
 * access to the package registry -- see the story summary). Same routes,
 * same contract, same error envelope; swapping this for a real Nest
 * controller later is a routing-layer change, not a service-layer one.
 */
function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      if (raw.length === 0) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", reject);
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

export function createAuthServer(deps: AuthServiceDeps): Server {
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method ?? "GET";
    const path = (req.url ?? "/").split("?")[0];

    try {
      if (method === "POST" && path === "/auth/sign-up") {
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
    } catch {
      return writeError(res, "internal", "Unexpected server error.");
    }
  });
}
