import { AuthApiError, type AuthAdapter, type AuthenticatedSession } from "../services/auth/types.ts";

export type VerifyBannerState = "none" | "wrong" | "locked" | "resend-cooldown" | "resend-limit";

export interface VerifyEmailFormState {
  code: string;
  bannerState: VerifyBannerState;
  codeInputDisabled: boolean;
  submitDisabled: boolean;
  resendDisabled: boolean;
  submitting: boolean;
  resending: boolean;
  authenticated: boolean;
  session: AuthenticatedSession | null;
}

/**
 * Framework-agnostic controller behind the verify-email screen (design
 * Screens 3/4), modeling the five state-toolbar variants: default, wrong
 * code (AC6), lockout (AC13), resend cooldown (AC16), resend limit
 * (AC17/AC18). Never calls `answerChallenge` (AC7) -- that method exists on
 * the adapter only for the sign-in-time path this screen must not touch.
 */
export function createVerifyEmailFormController(adapter: AuthAdapter, email: string) {
  let state: VerifyEmailFormState = {
    code: "",
    bannerState: "none",
    codeInputDisabled: false,
    submitDisabled: false,
    resendDisabled: false,
    submitting: false,
    resending: false,
    authenticated: false,
    session: null,
  };

  return {
    getState(): VerifyEmailFormState {
      return state;
    },
    setCode(code: string): void {
      state = { ...state, code };
    },
    async confirm(): Promise<void> {
      state = { ...state, submitting: true };
      try {
        const session = await adapter.confirmEmail({ email, code: state.code });
        state = { ...state, submitting: false, authenticated: true, bannerState: "none", session };
      } catch (error) {
        if (error instanceof AuthApiError && error.code === "confirm_email_locked") {
          state = {
            ...state,
            submitting: false,
            bannerState: "locked",
            codeInputDisabled: true,
            submitDisabled: true,
          };
          return;
        }
        state = { ...state, submitting: false, bannerState: "wrong" };
      }
    },
    async resend(): Promise<void> {
      state = { ...state, resending: true };
      try {
        await adapter.resendConfirmation({ email });
        state = { ...state, resending: false, bannerState: "none" };
      } catch (error) {
        if (error instanceof AuthApiError && error.code === "resend_cooldown") {
          state = { ...state, resending: false, bannerState: "resend-cooldown", resendDisabled: true };
          return;
        }
        if (error instanceof AuthApiError && error.code === "resend_limit_reached") {
          state = { ...state, resending: false, bannerState: "resend-limit", resendDisabled: true };
          return;
        }
        state = { ...state, resending: false };
      }
    },
  };
}
