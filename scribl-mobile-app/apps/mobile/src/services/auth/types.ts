import type {
  SignUpRequest,
  SignUpResult,
  ConfirmEmailRequest,
  ResendConfirmationRequest,
  ChallengeAnswerRequest,
  SignInResult,
} from "../../../../../packages/contracts/src/api/auth.ts";

export class AuthApiError extends Error {
  readonly code: string;
  readonly field?: string;

  constructor(code: string, message: string, field?: string) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.field = field;
  }
}

/**
 * One interface, adapters named for the vendor (service-seams.md section 3).
 * `answerChallenge` lives on the same interface as `confirmEmail` precisely
 * so AC7 is a cheap, precise spy test: assert the mock `answerChallenge` is
 * never called during a `confirmEmail` flow.
 */
export interface AuthAdapter {
  signUp(input: SignUpRequest): Promise<SignUpResult>;
  confirmEmail(input: ConfirmEmailRequest): Promise<void>;
  resendConfirmation(input: { email: string }): Promise<void>;
  answerChallenge(input: ChallengeAnswerRequest): Promise<SignInResult>;
}
