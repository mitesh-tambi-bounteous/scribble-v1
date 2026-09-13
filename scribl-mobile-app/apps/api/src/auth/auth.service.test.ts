import { test } from "node:test";
import assert from "node:assert/strict";
import { signUp, confirmEmail } from "./auth.service.ts";
import { LocalAuthAdapter } from "./adapters/local.ts";

const adultBody = {
  email: "matthew@example.com",
  password: "Str0ngPassword",
  displayName: "Matthew",
  dateOfBirth: "1990-04-12",
};

const minorBody = {
  email: "kid@example.com",
  password: "Str0ngPassword",
  displayName: "Kid",
  dateOfBirth: "2016-01-01",
};

test("signUp: adult dateOfBirth returns verification_required (AC1)", async () => {
  const adapter = new LocalAuthAdapter();
  const result = await signUp(adultBody, { adapter, appEnv: "dev" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.value, { kind: "verification_required", email: "matthew@example.com" });
  }
});

test("signUp: minor dateOfBirth returns parental_consent_required (AC2)", async () => {
  const adapter = new LocalAuthAdapter();
  const result = await signUp(minorBody, { adapter, appEnv: "dev" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.kind, "parental_consent_required");
    if (result.value.kind === "parental_consent_required") {
      assert.equal(result.value.accountClass, "minor");
      assert.equal(typeof result.value.consentRequestId, "string");
    }
  }
});

test("signUp: an implausibly old dateOfBirth (classifies as 'unknown') normalizes to accountClass 'minor', per ADR-0012", async () => {
  const adapter = new LocalAuthAdapter();
  const result = await signUp(
    { ...minorBody, email: "ancient@example.com", dateOfBirth: "1400-01-01" },
    { adapter, appEnv: "dev" },
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.kind, "parental_consent_required");
    if (result.value.kind === "parental_consent_required") {
      assert.equal(result.value.accountClass, "minor");
    }
  }
});

test("signUp: a minor never reaches account creation, even forcing prod's posture (AC3)", async () => {
  const adapter = new LocalAuthAdapter();
  const createUserCalls: unknown[] = [];
  const originalCreateUser = adapter.createUser.bind(adapter);
  adapter.createUser = async (input) => {
    createUserCalls.push(input);
    return originalCreateUser(input);
  };

  await signUp(minorBody, { adapter, appEnv: "prod" });

  assert.equal(createUserCalls.length, 0);
  assert.equal(await adapter.findUserByEmail(minorBody.email), null);
});

test("signUp: never returns a token, even on success (AC8)", async () => {
  const adapter = new LocalAuthAdapter();
  const result = await signUp(adultBody, { adapter, appEnv: "dev" });
  assert.equal(result.ok, true);
  const serialized = JSON.stringify(result.value);
  assert.doesNotMatch(serialized, /accessToken/);
  assert.doesNotMatch(serialized, /refreshToken/);
});

test("signUp: an already-registered email is rejected pointing to sign-in (AC11)", async () => {
  const adapter = new LocalAuthAdapter();
  const first = await signUp(adultBody, { adapter, appEnv: "dev" });
  assert.equal(first.ok, true);

  const second = await signUp(adultBody, { adapter, appEnv: "dev" });
  assert.equal(second.ok, false);
  if (!second.ok) {
    assert.equal(second.code, "conflict");
    assert.match(second.message, /already registered/i);
    assert.match(second.message, /sign in/i);
  }
});

test("confirmEmail: never invokes the sign-in-time challenge path (AC7)", async () => {
  const adapter = new LocalAuthAdapter();
  await signUp(adultBody, { adapter, appEnv: "dev" });
  const code = adapter.getLastSentCodeForTesting(adultBody.email)!;

  let challengeCalls = 0;
  const originalAnswerChallenge = adapter.answerChallenge.bind(adapter);
  adapter.answerChallenge = async (input) => {
    challengeCalls += 1;
    return originalAnswerChallenge(input);
  };

  const result = await confirmEmail({ email: adultBody.email, code }, { adapter, appEnv: "dev" });

  assert.equal(result.ok, true);
  assert.equal(challengeCalls, 0);
});
