import { test } from "node:test";
import assert from "node:assert/strict";
import { createVerifyEmailFormController } from "./verifyEmailFormController.ts";
import { AuthApiError, type AuthAdapter } from "../services/auth/types.ts";

const EMAIL = "matthew@example.com";

function makeAdapter(overrides: Partial<AuthAdapter> = {}): AuthAdapter {
  return {
    signUp: async () => {
      throw new Error("not used");
    },
    confirmEmail: async () => {},
    resendConfirmation: async () => {},
    answerChallenge: async () => {
      throw new Error("not used");
    },
    ...overrides,
  };
}

test("default state has no banner and nothing disabled", () => {
  const controller = createVerifyEmailFormController(makeAdapter(), EMAIL);
  const state = controller.getState();
  assert.equal(state.bannerState, "none");
  assert.equal(state.codeInputDisabled, false);
  assert.equal(state.submitDisabled, false);
  assert.equal(state.authenticated, false);
});

test("correct code establishes an authenticated session (AC5)", async () => {
  const controller = createVerifyEmailFormController(makeAdapter({ confirmEmail: async () => {} }), EMAIL);
  controller.setCode("482913");
  await controller.confirm();
  assert.equal(controller.getState().authenticated, true);
  assert.equal(controller.getState().bannerState, "none");
});

test("incorrect code surfaces the wrong-code banner and creates no session (AC6)", async () => {
  const controller = createVerifyEmailFormController(
    makeAdapter({
      confirmEmail: async () => {
        throw new AuthApiError("validation_failed", "That code isn't right.", "code");
      },
    }),
    EMAIL,
  );
  controller.setCode("000000");
  await controller.confirm();
  assert.equal(controller.getState().authenticated, false);
  assert.equal(controller.getState().bannerState, "wrong");
});

test("confirm() never calls answerChallenge (AC7)", async () => {
  let challengeCalls = 0;
  const controller = createVerifyEmailFormController(
    makeAdapter({
      answerChallenge: async () => {
        challengeCalls += 1;
        throw new Error("should not be called");
      },
    }),
    EMAIL,
  );
  controller.setCode("482913");
  await controller.confirm();
  assert.equal(challengeCalls, 0);
});

test("lockout disables both the code input and submit (AC13)", async () => {
  const controller = createVerifyEmailFormController(
    makeAdapter({
      confirmEmail: async () => {
        throw new AuthApiError("confirm_email_locked", "Too many attempts.");
      },
    }),
    EMAIL,
  );
  controller.setCode("000000");
  await controller.confirm();
  const state = controller.getState();
  assert.equal(state.bannerState, "locked");
  assert.equal(state.codeInputDisabled, true);
  assert.equal(state.submitDisabled, true);
});

test("resend cooldown disables only the resend control (AC16)", async () => {
  const controller = createVerifyEmailFormController(
    makeAdapter({
      resendConfirmation: async () => {
        throw new AuthApiError("resend_cooldown", "Please wait.");
      },
    }),
    EMAIL,
  );
  await controller.resend();
  const state = controller.getState();
  assert.equal(state.bannerState, "resend-cooldown");
  assert.equal(state.resendDisabled, true);
  assert.equal(state.codeInputDisabled, false);
  assert.equal(state.submitDisabled, false);
});

test("resend limit disables only the resend control and reflects no further code sent (AC17, AC18)", async () => {
  let resendCalls = 0;
  const controller = createVerifyEmailFormController(
    makeAdapter({
      resendConfirmation: async () => {
        resendCalls += 1;
        throw new AuthApiError("resend_limit_reached", "Limit reached.");
      },
    }),
    EMAIL,
  );
  await controller.resend();
  const state = controller.getState();
  assert.equal(state.bannerState, "resend-limit");
  assert.equal(state.resendDisabled, true);
  assert.equal(resendCalls, 1);
});
