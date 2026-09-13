import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalAuthAdapter } from "./local.ts";
import {
  CONFIRM_EMAIL_MAX_ATTEMPTS,
  RESEND_COOLDOWN_MS,
  RESEND_LIMIT_PER_WINDOW,
  RESEND_WINDOW_MS,
} from "../constants.ts";

function makeClock(startMs: number) {
  let current = startMs;
  return {
    now: () => current,
    advance: (ms: number) => {
      current += ms;
    },
  };
}

async function createConfirmedlessUser(adapter: LocalAuthAdapter, email: string) {
  await adapter.createUser({
    email,
    password: "Str0ngPassword",
    displayName: "Matthew",
    dateOfBirth: "1990-04-12",
    accountClass: "adult",
  });
  await adapter.requestConfirmationCode(email);
}

test("createUser + findUserByEmail round-trip", async () => {
  const adapter = new LocalAuthAdapter();
  const created = await adapter.createUser({
    email: "a@example.com",
    password: "Str0ngPassword",
    displayName: "A",
    dateOfBirth: "1990-04-12",
    accountClass: "adult",
  });
  const found = await adapter.findUserByEmail("a@example.com");
  assert.equal(found?.id, created.id);
  assert.equal(found?.emailVerified, false);
});

test("confirmEmail: correct code succeeds and establishes a session (AC5)", async () => {
  const adapter = new LocalAuthAdapter();
  const email = "adult@example.com";
  await createConfirmedlessUser(adapter, email);
  const code = adapter.getLastSentCodeForTesting(email);
  assert.ok(code);
  const result = await adapter.confirmEmail(email, code!);
  assert.equal(result.outcome, "success");
  const user = await adapter.findUserByEmail(email);
  assert.equal(user?.emailVerified, true);
});

test("confirmEmail: incorrect code creates no session (AC6)", async () => {
  const adapter = new LocalAuthAdapter();
  const email = "adult2@example.com";
  await createConfirmedlessUser(adapter, email);
  const result = await adapter.confirmEmail(email, "000000");
  assert.equal(result.outcome, "incorrect");
  const user = await adapter.findUserByEmail(email);
  assert.equal(user?.emailVerified, false);
});

test("confirmEmail: locks out after max failed attempts, before cooldown elapses (AC13)", async () => {
  const clock = makeClock(0);
  const adapter = new LocalAuthAdapter({ now: clock.now });
  const email = "lockout@example.com";
  await createConfirmedlessUser(adapter, email);

  for (let i = 0; i < CONFIRM_EMAIL_MAX_ATTEMPTS; i++) {
    const attempt = await adapter.confirmEmail(email, "000000");
    assert.equal(attempt.outcome, "incorrect");
  }

  const code = adapter.getLastSentCodeForTesting(email);
  const lockedAttempt = await adapter.confirmEmail(email, code!);
  assert.equal(lockedAttempt.outcome, "locked");
});

test("resendConfirmationCode: rejects a resend before the cooldown elapses (AC16)", async () => {
  const clock = makeClock(0);
  const adapter = new LocalAuthAdapter({ now: clock.now });
  const email = "cooldown@example.com";
  await createConfirmedlessUser(adapter, email);
  clock.advance(RESEND_COOLDOWN_MS + 1);

  const first = await adapter.resendConfirmationCode(email);
  assert.equal(first.outcome, "sent");

  const second = await adapter.resendConfirmationCode(email);
  assert.equal(second.outcome, "cooldown");
});

test("resendConfirmationCode: rejects once the per-window resend limit is reached, and sends no further code (AC17, AC18)", async () => {
  const clock = makeClock(0);
  const adapter = new LocalAuthAdapter({ now: clock.now });
  const email = "limit@example.com";
  await createConfirmedlessUser(adapter, email);
  clock.advance(RESEND_COOLDOWN_MS + 1);

  for (let i = 0; i < RESEND_LIMIT_PER_WINDOW; i++) {
    const result = await adapter.resendConfirmationCode(email);
    assert.equal(result.outcome, "sent");
    clock.advance(RESEND_COOLDOWN_MS + 1);
  }

  const codeBeforeLimitHit = adapter.getLastSentCodeForTesting(email);
  const limited = await adapter.resendConfirmationCode(email);
  assert.equal(limited.outcome, "limit_reached");
  assert.equal(adapter.getLastSentCodeForTesting(email), codeBeforeLimitHit);

  clock.advance(RESEND_WINDOW_MS + 1);
  const afterWindow = await adapter.resendConfirmationCode(email);
  assert.equal(afterWindow.outcome, "sent");
});

test("answerChallenge is a distinct method from confirmEmail (AC7 seam)", async () => {
  const adapter = new LocalAuthAdapter();
  assert.equal(typeof adapter.answerChallenge, "function");
  assert.notEqual(adapter.answerChallenge, adapter.confirmEmail);
});
