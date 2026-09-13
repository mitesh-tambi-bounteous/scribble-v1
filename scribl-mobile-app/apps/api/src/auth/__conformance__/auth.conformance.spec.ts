import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalAuthAdapter } from "../adapters/local.ts";
import { CognitoAuthAdapter } from "../adapters/cognito.ts";
import type { AuthAdapter } from "../adapters/types.ts";

/**
 * One shared suite, both adapters (register 6.1 / E01-F5 "contract
 * conformance"): asserts the local and Cognito adapters would produce
 * identical shapes off the same `AuthAdapter` interface. Cognito cases are
 * skipped with a reason string until E01-F1 (AWS accounts) unblocks real
 * credentials -- never exercised by a passing test that requires AWS.
 */
const adapters: Array<{ name: string; make: () => AuthAdapter; skip?: string }> = [
  { name: "local", make: () => new LocalAuthAdapter() },
  {
    name: "cognito",
    make: () => new CognitoAuthAdapter(),
    skip: "E01-F1 (AWS accounts and three environments) is Blocked; no real Cognito credential exists yet.",
  },
];

for (const { name, make, skip } of adapters) {
  test(`${name}: findUserByEmail returns null for an unknown address`, { skip }, async () => {
    const adapter = make();
    assert.equal(await adapter.findUserByEmail("nobody@example.com"), null);
  });

  test(`${name}: createUser + findUserByEmail round-trip with no passwordHash on the returned shape`, { skip }, async () => {
    const adapter = make();
    const created = await adapter.createUser({
      email: "a@example.com",
      password: "Str0ngPassword",
      displayName: "A",
      dateOfBirth: "1990-04-12",
      accountClass: "adult",
    });
    assert.ok(!("passwordHash" in created));
    assert.ok(!("password" in created));
    const found = await adapter.findUserByEmail("a@example.com");
    assert.deepEqual(found, created);
  });

  test(`${name}: answerChallenge is a distinct method from confirmEmail`, { skip }, async () => {
    const adapter = make();
    assert.equal(typeof adapter.answerChallenge, "function");
    assert.notEqual(adapter.answerChallenge, adapter.confirmEmail);
  });
}
