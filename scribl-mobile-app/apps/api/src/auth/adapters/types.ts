import type { AccountClass } from "../../../../../packages/contracts/src/domain/account-class.ts";

export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  dateOfBirth: string;
  accountClass: AccountClass;
  emailVerified: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  displayName: string;
  dateOfBirth: string;
  accountClass: AccountClass;
}

export type ConfirmEmailOutcome =
  | { outcome: "success"; sessionId: string; accessToken: string }
  | { outcome: "incorrect" }
  | { outcome: "locked" };

export type ResendOutcome =
  | { outcome: "sent" }
  | { outcome: "cooldown" }
  | { outcome: "limit_reached" };

export type ChallengeKind = "email_verification" | "new_password_required" | "mfa_totp" | "mfa_sms";

export interface ChallengeAnswerInput {
  challengeToken: string;
  kind: ChallengeKind;
  answer: string;
}

export type SignInOutcome =
  | { outcome: "authenticated"; sessionId: string; accessToken: string; user: StoredUser }
  | { outcome: "challenge"; challengeToken: string; kind: ChallengeKind }
  | { outcome: "invalid_credentials" };

export type ChallengeAnswerOutcome =
  | { outcome: "authenticated"; sessionId: string; accessToken: string; user: StoredUser }
  | { outcome: "invalid" };

/**
 * One interface, two adapters (register 6.1 / service-seams.md): `local` is
 * the real, fully-tested default; `cognito` is a same-shaped stub seam until
 * E01-F1 (AWS accounts) unblocks it.
 */
export interface AuthAdapter {
  findUserByEmail(email: string): Promise<StoredUser | null>;
  createUser(input: CreateUserInput): Promise<StoredUser>;
  sendConfirmationEmail(email: string, code: string): Promise<void>;
  requestConfirmationCode(email: string): Promise<void>;
  confirmEmail(email: string, code: string): Promise<ConfirmEmailOutcome>;
  resendConfirmationCode(email: string): Promise<ResendOutcome>;
  signIn(email: string, password: string): Promise<SignInOutcome>;
  answerChallenge(input: ChallengeAnswerInput): Promise<ChallengeAnswerOutcome>;
}

export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method} is not implemented on this adapter yet.`);
    this.name = "NotImplementedError";
  }
}
