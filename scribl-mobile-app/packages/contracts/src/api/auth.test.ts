import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSignUpRequest, validateSignInRequest } from "./auth.ts";

const validAdultBody = {
  email: "matthew@example.com",
  password: "Str0ngPassword",
  displayName: "Matthew",
  dateOfBirth: "1990-04-12",
};

test("validateSignUpRequest: accepts a well-formed adult submission", () => {
  const result = validateSignUpRequest(validAdultBody);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.email, "matthew@example.com");
    assert.equal(result.value.dateOfBirth, "1990-04-12");
  }
});

test("validateSignUpRequest: rejects an unparseable dateOfBirth, field-scoped (AC4)", () => {
  const result = validateSignUpRequest({ ...validAdultBody, dateOfBirth: "not-a-date" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.kind, "validation_failed");
    assert.equal(result.field, "dateOfBirth");
    assert.match(result.message, /date of birth/i);
  }
});

test("validateSignUpRequest: rejects a future dateOfBirth, field-scoped (AC4)", () => {
  const result = validateSignUpRequest({ ...validAdultBody, dateOfBirth: "2099-01-01" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.kind, "validation_failed");
    assert.equal(result.field, "dateOfBirth");
  }
});

test("validateSignUpRequest: rejects a password failing the policy, field-scoped (AC12)", () => {
  const result = validateSignUpRequest({ ...validAdultBody, password: "hunter2" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.kind, "validation_failed");
    assert.equal(result.field, "password");
    assert.match(result.message, /password/i);
  }
});

test("validateSignUpRequest: rejects a providerToken payload as unsupported auth method (AC10)", () => {
  const result = validateSignUpRequest({ ...validAdultBody, providerToken: "abc" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.kind, "unsupported_auth_method");
  }
});

test("validateSignUpRequest: rejects a phoneNumber payload as unsupported auth method (AC10)", () => {
  const result = validateSignUpRequest({ ...validAdultBody, phoneNumber: "+15551234567" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.kind, "unsupported_auth_method");
  }
});

test("validateSignUpRequest: rejects a missing displayName", () => {
  const { displayName, ...rest } = validAdultBody;
  const result = validateSignUpRequest(rest);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.kind, "validation_failed");
    assert.equal(result.field, "displayName");
  }
});

test("validateSignInRequest: rejects a phoneNumber payload as unsupported auth method (AC10)", () => {
  const result = validateSignInRequest({ phoneNumber: "+15551234567" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.kind, "unsupported_auth_method");
  }
});

test("validateSignInRequest: accepts a well-formed email/password submission", () => {
  const result = validateSignInRequest({ email: "matthew@example.com", password: "Str0ngPassword" });
  assert.equal(result.ok, true);
});
