import type {
  AuthAdapter,
  ChallengeAnswerInput,
  ChallengeAnswerOutcome,
  ConfirmEmailOutcome,
  CreateUserInput,
  ResendOutcome,
  SignInOutcome,
  StoredUser,
} from "./types.ts";
import { NotImplementedError } from "./types.ts";

/**
 * Same-interface seam for the Cognito-managed user pool. Real AWS
 * provisioning is E01-F1, currently "Blocked" -- every method throws until
 * that unblocks, per register 6.1's stub-adapter pattern. Never exercised by
 * a passing test that requires real AWS.
 */
export class CognitoAuthAdapter implements AuthAdapter {
  async findUserByEmail(_email: string): Promise<StoredUser | null> {
    throw new NotImplementedError("CognitoAuthAdapter.findUserByEmail");
  }

  async createUser(_input: CreateUserInput): Promise<StoredUser> {
    throw new NotImplementedError("CognitoAuthAdapter.createUser");
  }

  async sendConfirmationEmail(_email: string, _code: string): Promise<void> {
    throw new NotImplementedError("CognitoAuthAdapter.sendConfirmationEmail");
  }

  async requestConfirmationCode(_email: string): Promise<void> {
    throw new NotImplementedError("CognitoAuthAdapter.requestConfirmationCode");
  }

  async confirmEmail(_email: string, _code: string): Promise<ConfirmEmailOutcome> {
    throw new NotImplementedError("CognitoAuthAdapter.confirmEmail");
  }

  async resendConfirmationCode(_email: string): Promise<ResendOutcome> {
    throw new NotImplementedError("CognitoAuthAdapter.resendConfirmationCode");
  }

  async signIn(_email: string, _password: string): Promise<SignInOutcome> {
    throw new NotImplementedError("CognitoAuthAdapter.signIn");
  }

  async answerChallenge(_input: ChallengeAnswerInput): Promise<ChallengeAnswerOutcome> {
    throw new NotImplementedError("CognitoAuthAdapter.answerChallenge");
  }
}
