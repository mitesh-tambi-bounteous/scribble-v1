import { test } from "node:test";
import assert from "node:assert/strict";
import { createSignUpFormController } from "./signUpFormController.ts";
import type { AuthAdapter } from "../services/auth/types.ts";
import { AuthApiError } from "../services/auth/types.ts";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const validFields = {
  email: "matthew@example.com",
  password: "Str0ngPassword",
  displayName: "Matthew",
  dateOfBirth: "1990-04-12",
};

test("submit control is disabled while POST /auth/sign-up is in flight (AC14)", async () => {
  const pending = deferred<{ kind: "verification_required"; email: string }>();
  const adapter: AuthAdapter = {
    signUp: () => pending.promise,
    confirmEmail: async () => {},
    resendConfirmation: async () => {},
    answerChallenge: async () => {
      throw new Error("not used");
    },
  };
  const controller = createSignUpFormController(adapter);
  controller.setFields(validFields);

  assert.equal(controller.getState().submitDisabled, false);
  const submitPromise = controller.submit();
  assert.equal(controller.getState().submitDisabled, true);

  pending.resolve({ kind: "verification_required", email: validFields.email });
  await submitPromise;
  assert.equal(controller.getState().submitDisabled, false);
});

test("a loading indicator shows while POST /auth/sign-up is in flight (AC15)", async () => {
  const pending = deferred<{ kind: "verification_required"; email: string }>();
  const adapter: AuthAdapter = {
    signUp: () => pending.promise,
    confirmEmail: async () => {},
    resendConfirmation: async () => {},
    answerChallenge: async () => {
      throw new Error("not used");
    },
  };
  const controller = createSignUpFormController(adapter);
  controller.setFields(validFields);

  assert.equal(controller.getState().showLoadingIndicator, false);
  const submitPromise = controller.submit();
  assert.equal(controller.getState().showLoadingIndicator, true);

  pending.resolve({ kind: "verification_required", email: validFields.email });
  await submitPromise;
  assert.equal(controller.getState().showLoadingIndicator, false);
});

test("on success, stores the discriminated result and clears any error", async () => {
  const adapter: AuthAdapter = {
    signUp: async () => ({ kind: "verification_required", email: validFields.email }),
    confirmEmail: async () => {},
    resendConfirmation: async () => {},
    answerChallenge: async () => {
      throw new Error("not used");
    },
  };
  const controller = createSignUpFormController(adapter);
  controller.setFields(validFields);
  await controller.submit();

  const state = controller.getState();
  assert.deepEqual(state.result, { kind: "verification_required", email: validFields.email });
  assert.equal(state.error, null);
});

test("on a field-scoped server error, stores it against that field (e.g. AC4/AC11/AC12)", async () => {
  const adapter: AuthAdapter = {
    signUp: async () => {
      throw new AuthApiError("validation_failed", "Enter a valid date of birth that isn't in the future.", "dateOfBirth");
    },
    confirmEmail: async () => {},
    resendConfirmation: async () => {},
    answerChallenge: async () => {
      throw new Error("not used");
    },
  };
  const controller = createSignUpFormController(adapter);
  controller.setFields({ ...validFields, dateOfBirth: "2099-01-01" });
  await controller.submit();

  const state = controller.getState();
  assert.equal(state.result, null);
  assert.equal(state.error?.field, "dateOfBirth");
  assert.match(state.error?.message ?? "", /date of birth/i);
  assert.equal(state.submitDisabled, false);
});
