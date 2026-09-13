import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalAuthAdapter } from "./local.ts";
import { AuthApiError } from "../types.ts";

function fakeFetchOnce(status: number, body: unknown) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchFn = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return {
      status,
      json: async () => body,
    } as Response;
  };
  return { fetchFn, calls };
}

test("signUp: posts to /auth/sign-up and returns the parsed result", async () => {
  const { fetchFn, calls } = fakeFetchOnce(200, { kind: "verification_required", email: "a@example.com" });
  const adapter = new LocalAuthAdapter({ baseUrl: "http://api.test", fetchFn });

  const result = await adapter.signUp({
    email: "a@example.com",
    password: "Str0ngPassword",
    displayName: "A",
    dateOfBirth: "1990-04-12",
  });

  assert.deepEqual(result, { kind: "verification_required", email: "a@example.com" });
  assert.equal(calls[0]?.url, "http://api.test/auth/sign-up");
});

test("signUp: a non-2xx response throws an AuthApiError carrying code/field/message", async () => {
  const { fetchFn } = fakeFetchOnce(422, { code: "validation_failed", field: "dateOfBirth", message: "bad dob" });
  const adapter = new LocalAuthAdapter({ baseUrl: "http://api.test", fetchFn });

  await assert.rejects(
    () =>
      adapter.signUp({
        email: "a@example.com",
        password: "Str0ngPassword",
        displayName: "A",
        dateOfBirth: "2099-01-01",
      }),
    (error: unknown) => {
      assert.ok(error instanceof AuthApiError);
      assert.equal(error.code, "validation_failed");
      assert.equal(error.field, "dateOfBirth");
      return true;
    },
  );
});

test("confirmEmail: never calls the sign-in-time challenge endpoint (AC7)", async () => {
  const calledUrls: string[] = [];
  const fetchFn = async (url: string) => {
    calledUrls.push(url);
    return { status: 200, json: async () => ({}) } as Response;
  };
  const adapter = new LocalAuthAdapter({ baseUrl: "http://api.test", fetchFn });

  await adapter.confirmEmail({ email: "a@example.com", code: "482913" });

  assert.ok(calledUrls.every((url) => !url.includes("/auth/challenge")));
  assert.ok(calledUrls.some((url) => url.includes("/auth/confirm-email")));
});

test("answerChallenge is a distinct method, spyable independently of confirmEmail (AC7 seam)", async () => {
  const { fetchFn } = fakeFetchOnce(200, {
    kind: "authenticated",
    user: {},
    capabilities: {},
  });
  const adapter = new LocalAuthAdapter({ baseUrl: "http://api.test", fetchFn });

  let answerChallengeCalls = 0;
  const original = adapter.answerChallenge.bind(adapter);
  adapter.answerChallenge = async (input) => {
    answerChallengeCalls += 1;
    return original(input);
  };

  await adapter.confirmEmail({ email: "a@example.com", code: "482913" });

  assert.equal(answerChallengeCalls, 0);
});

test("resendConfirmation: posts to /auth/confirm-email/resend", async () => {
  const { fetchFn, calls } = fakeFetchOnce(200, {});
  const adapter = new LocalAuthAdapter({ baseUrl: "http://api.test", fetchFn });

  await adapter.resendConfirmation({ email: "a@example.com" });

  assert.equal(calls[0]?.url, "http://api.test/auth/confirm-email/resend");
});
