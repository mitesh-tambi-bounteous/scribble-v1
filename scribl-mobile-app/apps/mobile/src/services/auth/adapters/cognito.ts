import type {
  SignUpRequest,
  SignUpResult,
  ConfirmEmailRequest,
  ChallengeAnswerRequest,
  SignInResult,
} from "../../../../../../packages/contracts/src/api/auth.ts";
import type { AuthAdapter, AuthenticatedSession } from "../types.ts";

class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method} is not implemented on this adapter yet.`);
    this.name = "NotImplementedError";
  }
}

/**
 * Same-interface stub seam. service-seams.md 4.1: the real client is a thin
 * fetch adapter against Cognito's IdP API (no Amplify, no AWS SDK -- it
 * fails to bundle in React Native). Not built out in this story; every
 * method throws until that work lands.
 */
export class CognitoAuthAdapter implements AuthAdapter {
  async signUp(_input: SignUpRequest): Promise<SignUpResult> {
    throw new NotImplementedError("CognitoAuthAdapter.signUp");
  }

  async confirmEmail(_input: ConfirmEmailRequest): Promise<AuthenticatedSession> {
    throw new NotImplementedError("CognitoAuthAdapter.confirmEmail");
  }

  async resendConfirmation(_input: { email: string }): Promise<void> {
    throw new NotImplementedError("CognitoAuthAdapter.resendConfirmation");
  }

  async answerChallenge(_input: ChallengeAnswerRequest): Promise<SignInResult> {
    throw new NotImplementedError("CognitoAuthAdapter.answerChallenge");
  }
}
