import type { SignUpRequest, SignUpResult } from "../../../../packages/contracts/src/api/auth.ts";
import { AuthApiError, type AuthAdapter } from "../services/auth/types.ts";

export interface SignUpFormError {
  code: string;
  field?: string;
  message: string;
}

export interface SignUpFormState {
  fields: SignUpRequest;
  submitDisabled: boolean;
  showLoadingIndicator: boolean;
  result: SignUpResult | null;
  error: SignUpFormError | null;
}

const EMPTY_FIELDS: SignUpRequest = { email: "", password: "", displayName: "", dateOfBirth: "" };

/**
 * Framework-agnostic controller behind the sign-up screen (Screens 1/2/7).
 * `apps/mobile/app/sign-up.tsx` is a thin view bound to this: every rule the
 * ACs care about (disabled submit, loading indicator, field-scoped errors)
 * lives here where it is directly unit-testable without a React renderer.
 */
export function createSignUpFormController(adapter: AuthAdapter) {
  let state: SignUpFormState = {
    fields: EMPTY_FIELDS,
    submitDisabled: false,
    showLoadingIndicator: false,
    result: null,
    error: null,
  };
  const listeners = new Set<() => void>();

  function notify() {
    for (const listener of listeners) listener();
  }

  return {
    getState(): SignUpFormState {
      return state;
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setFields(fields: SignUpRequest): void {
      state = { ...state, fields };
      notify();
    },
    async submit(): Promise<void> {
      state = { ...state, submitDisabled: true, showLoadingIndicator: true, error: null };
      notify();
      try {
        const result = await adapter.signUp(state.fields);
        state = { ...state, submitDisabled: false, showLoadingIndicator: false, result, error: null };
      } catch (error) {
        const formError: SignUpFormError =
          error instanceof AuthApiError
            ? { code: error.code, field: error.field, message: error.message }
            : { code: "internal", message: "Something went wrong. Please try again." };
        state = { ...state, submitDisabled: false, showLoadingIndicator: false, result: null, error: formError };
      }
      notify();
    },
  };
}
