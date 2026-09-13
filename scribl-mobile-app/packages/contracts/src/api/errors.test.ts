import { test } from "node:test";
import assert from "node:assert/strict";
import { ERROR_CODES, ERROR_STATUS, isErrorCode } from "./errors.ts";

test("ERROR_CODES includes the documented 11-code union", () => {
  for (const code of [
    "unauthenticated",
    "forbidden",
    "submission_required",
    "parental_consent_required",
    "not_found",
    "validation_failed",
    "conflict",
    "rate_limited",
    "invite_invalid",
    "invite_expired",
    "internal",
  ]) {
    assert.ok(ERROR_CODES.includes(code as (typeof ERROR_CODES)[number]), code);
  }
});

test("ERROR_CODES adds this story's distinguishable codes (contract gap, see api-contract-draft.md)", () => {
  for (const code of [
    "unsupported_auth_method",
    "confirm_email_locked",
    "resend_cooldown",
    "resend_limit_reached",
    "payload_too_large",
  ]) {
    assert.ok(ERROR_CODES.includes(code as (typeof ERROR_CODES)[number]), code);
  }
});

test("isErrorCode narrows unknown strings", () => {
  assert.equal(isErrorCode("validation_failed"), true);
  assert.equal(isErrorCode("totally_made_up"), false);
});

test("every error code has a mapped HTTP status", () => {
  for (const code of ERROR_CODES) {
    assert.equal(typeof ERROR_STATUS[code], "number", code);
  }
  assert.equal(ERROR_STATUS.unsupported_auth_method, 400);
  assert.equal(ERROR_STATUS.confirm_email_locked, 429);
  assert.equal(ERROR_STATUS.resend_cooldown, 429);
  assert.equal(ERROR_STATUS.resend_limit_reached, 429);
  assert.equal(ERROR_STATUS.conflict, 409);
  assert.equal(ERROR_STATUS.validation_failed, 422);
  assert.equal(ERROR_STATUS.not_found, 404);
  assert.equal(ERROR_STATUS.payload_too_large, 413);
});
