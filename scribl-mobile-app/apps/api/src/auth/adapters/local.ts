import { randomUUID, randomInt } from "node:crypto";
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
import {
  CONFIRM_EMAIL_LOCKOUT_MS,
  CONFIRM_EMAIL_MAX_ATTEMPTS,
  RESEND_COOLDOWN_MS,
  RESEND_LIMIT_PER_WINDOW,
  RESEND_WINDOW_MS,
} from "../constants.ts";

interface InternalUser extends StoredUser {
  passwordHash: string;
}

interface ConfirmationState {
  code: string;
  failedAttempts: number;
  lockedUntil: number | null;
  lastSentAt: number;
  resendCount: number;
  windowStartedAt: number;
}

interface ChallengeState {
  email: string;
  kind: "email_verification";
  code: string;
}

function hashPassword(password: string): string {
  // Local/dev adapter only: a real pool would verify via Cognito SRP, never
  // see a plaintext password. This is not meant to be a production KDF.
  return `local-hash:${Buffer.from(password).toString("base64")}`;
}

function generateSixDigitCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/**
 * Real, fully-tested local adapter -- in-memory user store, deterministic
 * fake email codes (readable via `getLastSentCodeForTesting`), and
 * in-process attempt/cooldown/resend counters. Register 6.1: "a local
 * adapter that is genuinely useful, not a no-op."
 */
export class LocalAuthAdapter implements AuthAdapter {
  private readonly usersByEmail = new Map<string, InternalUser>();
  private readonly confirmationsByEmail = new Map<string, ConfirmationState>();
  private readonly sessionsById = new Map<string, { userId: string }>();
  private readonly challengesByToken = new Map<string, ChallengeState>();
  private readonly now: () => number;

  constructor(options: { now?: () => number } = {}) {
    this.now = options.now ?? (() => Date.now());
  }

  async findUserByEmail(email: string): Promise<StoredUser | null> {
    const user = this.usersByEmail.get(email);
    if (!user) return null;
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async createUser(input: CreateUserInput): Promise<StoredUser> {
    const user: InternalUser = {
      id: randomUUID(),
      email: input.email,
      displayName: input.displayName,
      dateOfBirth: input.dateOfBirth,
      accountClass: input.accountClass,
      emailVerified: false,
      createdAt: new Date(this.now()).toISOString(),
      passwordHash: hashPassword(input.password),
    };
    this.usersByEmail.set(input.email, user);
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    const now = this.now();
    const existing = this.confirmationsByEmail.get(email);
    this.confirmationsByEmail.set(email, {
      code,
      failedAttempts: 0,
      lockedUntil: null,
      lastSentAt: now,
      resendCount: existing?.resendCount ?? 0,
      windowStartedAt: existing?.windowStartedAt ?? now,
    });
  }

  async requestConfirmationCode(email: string): Promise<void> {
    await this.sendConfirmationEmail(email, generateSixDigitCode());
  }

  getLastSentCodeForTesting(email: string): string | undefined {
    return this.confirmationsByEmail.get(email)?.code;
  }

  async confirmEmail(email: string, code: string): Promise<ConfirmEmailOutcome> {
    const state = this.confirmationsByEmail.get(email);
    const now = this.now();
    if (!state) return { outcome: "incorrect" };

    if (state.lockedUntil !== null && now < state.lockedUntil) {
      return { outcome: "locked" };
    }

    if (state.failedAttempts >= CONFIRM_EMAIL_MAX_ATTEMPTS) {
      state.lockedUntil = now + CONFIRM_EMAIL_LOCKOUT_MS;
      return { outcome: "locked" };
    }

    if (state.code !== code) {
      state.failedAttempts += 1;
      return { outcome: "incorrect" };
    }

    const user = this.usersByEmail.get(email);
    if (!user) return { outcome: "incorrect" };
    user.emailVerified = true;
    state.failedAttempts = 0;
    state.lockedUntil = null;

    const sessionId = randomUUID();
    this.sessionsById.set(sessionId, { userId: user.id });
    return { outcome: "success", sessionId, accessToken: `local-access-token:${sessionId}` };
  }

  async resendConfirmationCode(email: string): Promise<ResendOutcome> {
    const now = this.now();
    const state = this.confirmationsByEmail.get(email);

    if (!state) {
      await this.requestConfirmationCode(email);
      const created = this.confirmationsByEmail.get(email)!;
      created.resendCount = 1;
      created.windowStartedAt = now;
      return { outcome: "sent" };
    }

    if (now - state.windowStartedAt > RESEND_WINDOW_MS) {
      state.windowStartedAt = now;
      state.resendCount = 0;
    }

    if (now - state.lastSentAt < RESEND_COOLDOWN_MS) {
      return { outcome: "cooldown" };
    }

    if (state.resendCount >= RESEND_LIMIT_PER_WINDOW) {
      return { outcome: "limit_reached" };
    }

    const newCode = generateSixDigitCode();
    state.code = newCode;
    state.lastSentAt = now;
    state.resendCount += 1;
    state.failedAttempts = 0;
    state.lockedUntil = null;
    return { outcome: "sent" };
  }

  async signIn(email: string, password: string): Promise<SignInOutcome> {
    const user = this.usersByEmail.get(email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return { outcome: "invalid_credentials" };
    }
    if (!user.emailVerified) {
      const challengeToken = randomUUID();
      this.challengesByToken.set(challengeToken, {
        email,
        kind: "email_verification",
        code: this.confirmationsByEmail.get(email)?.code ?? generateSixDigitCode(),
      });
      return { outcome: "challenge", challengeToken, kind: "email_verification" };
    }
    const sessionId = randomUUID();
    this.sessionsById.set(sessionId, { userId: user.id });
    const { passwordHash: _passwordHash, ...rest } = user;
    return { outcome: "authenticated", sessionId, accessToken: `local-access-token:${sessionId}`, user: rest };
  }

  async answerChallenge(input: ChallengeAnswerInput): Promise<ChallengeAnswerOutcome> {
    const challenge = this.challengesByToken.get(input.challengeToken);
    if (!challenge || challenge.kind !== input.kind || challenge.code !== input.answer) {
      return { outcome: "invalid" };
    }
    const user = this.usersByEmail.get(challenge.email);
    if (!user) return { outcome: "invalid" };
    user.emailVerified = true;
    this.challengesByToken.delete(input.challengeToken);
    const sessionId = randomUUID();
    this.sessionsById.set(sessionId, { userId: user.id });
    const { passwordHash: _passwordHash, ...rest } = user;
    return { outcome: "authenticated", sessionId, accessToken: `local-access-token:${sessionId}`, user: rest };
  }

  hasSessionForTesting(sessionId: string): boolean {
    return this.sessionsById.has(sessionId);
  }
}
