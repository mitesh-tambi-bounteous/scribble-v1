import { test } from "node:test";
import assert from "node:assert/strict";
import { createAuthServer } from "./server.ts";
import { LocalAuthAdapter } from "./adapters/local.ts";
import {
  CONFIRM_EMAIL_MAX_ATTEMPTS,
  RESEND_COOLDOWN_MS,
  RESEND_LIMIT_PER_WINDOW,
} from "./constants.ts";

function makeClock(startMs: number) {
  let current = startMs;
  return { now: () => current, advance: (ms: number) => (current += ms) };
}

async function withServer(
  adapter: LocalAuthAdapter,
  fn: (baseUrl: string) => Promise<void>,
) {
  const server = createAuthServer({ adapter, appEnv: "dev" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (typeof address !== "object" || address === null) throw new Error("no port");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    await fn(baseUrl);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

const adultBody = {
  email: "matthew@example.com",
  password: "Str0ngPassword",
  displayName: "Matthew",
  dateOfBirth: "1990-04-12",
};

async function postJson(baseUrl: string, path: string, body: unknown) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { status: res.status, json };
}

test("POST /auth/sign-up: adult returns 200 verification_required (AC1)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    const { status, json } = await postJson(baseUrl, "/auth/sign-up", adultBody);
    assert.equal(status, 200);
    assert.deepEqual(json, { kind: "verification_required", email: adultBody.email });
  });
});

test("POST /auth/sign-up: minor returns 200 parental_consent_required (AC2)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    const { status, json } = await postJson(baseUrl, "/auth/sign-up", {
      ...adultBody,
      email: "kid@example.com",
      dateOfBirth: "2016-01-01",
    });
    assert.equal(status, 200);
    assert.equal(json.kind, "parental_consent_required");
  });
});

test("POST /auth/sign-up: unparseable/future dateOfBirth is a field-scoped validation error (AC4)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    for (const dateOfBirth of ["not-a-date", "2099-01-01"]) {
      const { status, json } = await postJson(baseUrl, "/auth/sign-up", { ...adultBody, dateOfBirth });
      assert.equal(status, 422);
      assert.equal(json.code, "validation_failed");
      assert.match(json.message, /date of birth/i);
    }
  });
});

test("POST /auth/sign-up never includes a token in its response (AC8)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    const { json } = await postJson(baseUrl, "/auth/sign-up", adultBody);
    assert.ok(!("accessToken" in json));
    assert.ok(!("refreshToken" in json));
  });
});

test("unmapped social/phone routes 404 in the contract's not_found envelope (AC9)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    const res1 = await fetch(`${baseUrl}/auth/federated/google`, { method: "POST" });
    assert.equal(res1.status, 404);
    assert.equal((await res1.json()).code, "not_found");

    const res2 = await fetch(`${baseUrl}/auth/sign-up/phone`, { method: "POST" });
    assert.equal(res2.status, 404);
    assert.equal((await res2.json()).code, "not_found");
  });
});

test("POST /auth/sign-up: a federated/phone payload is rejected as unsupported_auth_method (AC10)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    const { status, json } = await postJson(baseUrl, "/auth/sign-up", { ...adultBody, providerToken: "abc" });
    assert.equal(status, 400);
    assert.equal(json.code, "unsupported_auth_method");
  });
});

test("POST /auth/sign-in: a phoneNumber payload is rejected as unsupported_auth_method (AC10)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    const { status, json } = await postJson(baseUrl, "/auth/sign-in", { phoneNumber: "+15551234567" });
    assert.equal(status, 400);
    assert.equal(json.code, "unsupported_auth_method");
  });
});

test("POST /auth/sign-up: an already-registered email is rejected (AC11)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    await postJson(baseUrl, "/auth/sign-up", adultBody);
    const { status, json } = await postJson(baseUrl, "/auth/sign-up", adultBody);
    assert.equal(status, 409);
    assert.match(json.message, /already registered/i);
    assert.match(json.message, /sign in/i);
  });
});

test("POST /auth/sign-up: a policy-violating password is a field-scoped error (AC12)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    const { status, json } = await postJson(baseUrl, "/auth/sign-up", { ...adultBody, password: "hunter2" });
    assert.equal(status, 422);
    assert.match(json.message, /password/i);
  });
});

test("POST /auth/confirm-email: correct code establishes an authenticated session (AC5)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    await postJson(baseUrl, "/auth/sign-up", adultBody);
    const code = adapter.getLastSentCodeForTesting(adultBody.email)!;
    const { status, json } = await postJson(baseUrl, "/auth/confirm-email", { email: adultBody.email, code });
    assert.equal(status, 200);
    assert.equal(typeof json.sessionId, "string");
    assert.ok(adapter.hasSessionForTesting(json.sessionId));
  });
});

test("POST /auth/confirm-email: incorrect code creates no session (AC6)", async () => {
  const adapter = new LocalAuthAdapter();
  await withServer(adapter, async (baseUrl) => {
    await postJson(baseUrl, "/auth/sign-up", adultBody);
    const { status, json } = await postJson(baseUrl, "/auth/confirm-email", {
      email: adultBody.email,
      code: "000000",
    });
    assert.notEqual(status, 200);
    assert.equal(json.sessionId, undefined);
  });
});

test("POST /auth/confirm-email: locks out after max failed attempts (AC13)", async () => {
  const clock = makeClock(0);
  const adapter = new LocalAuthAdapter({ now: clock.now });
  await withServer(adapter, async (baseUrl) => {
    await postJson(baseUrl, "/auth/sign-up", adultBody);
    for (let i = 0; i < CONFIRM_EMAIL_MAX_ATTEMPTS; i++) {
      await postJson(baseUrl, "/auth/confirm-email", { email: adultBody.email, code: "000000" });
    }
    const code = adapter.getLastSentCodeForTesting(adultBody.email)!;
    const { status, json } = await postJson(baseUrl, "/auth/confirm-email", { email: adultBody.email, code });
    assert.equal(status, 429);
    assert.equal(json.code, "confirm_email_locked");
  });
});

test("POST /auth/confirm-email/resend: rejects before the cooldown elapses (AC16)", async () => {
  const clock = makeClock(0);
  const adapter = new LocalAuthAdapter({ now: clock.now });
  await withServer(adapter, async (baseUrl) => {
    await postJson(baseUrl, "/auth/sign-up", adultBody);
    clock.advance(RESEND_COOLDOWN_MS + 1);
    await postJson(baseUrl, "/auth/confirm-email/resend", { email: adultBody.email });
    const { status, json } = await postJson(baseUrl, "/auth/confirm-email/resend", { email: adultBody.email });
    assert.equal(status, 429);
    assert.equal(json.code, "resend_cooldown");
  });
});

test("POST /auth/confirm-email/resend: rejects at the per-window limit, sending no further code (AC17, AC18)", async () => {
  const clock = makeClock(0);
  const adapter = new LocalAuthAdapter({ now: clock.now });
  await withServer(adapter, async (baseUrl) => {
    await postJson(baseUrl, "/auth/sign-up", adultBody);
    clock.advance(RESEND_COOLDOWN_MS + 1);
    for (let i = 0; i < RESEND_LIMIT_PER_WINDOW; i++) {
      await postJson(baseUrl, "/auth/confirm-email/resend", { email: adultBody.email });
      clock.advance(RESEND_COOLDOWN_MS + 1);
    }
    const codeBefore = adapter.getLastSentCodeForTesting(adultBody.email);
    const { status, json } = await postJson(baseUrl, "/auth/confirm-email/resend", { email: adultBody.email });
    assert.equal(status, 429);
    assert.equal(json.code, "resend_limit_reached");
    assert.equal(adapter.getLastSentCodeForTesting(adultBody.email), codeBefore);
  });
});
