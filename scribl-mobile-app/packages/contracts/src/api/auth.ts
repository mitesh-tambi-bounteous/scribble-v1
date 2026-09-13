import type { AccountClass } from "../domain/account-class.ts";

export interface SignUpRequest {
  email: string;
  password: string;
  displayName: string;
  dateOfBirth: string;
  inviteToken?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ConfirmEmailRequest {
  email: string;
  code: string;
}

export interface ResendConfirmationRequest {
  email: string;
}

/** Never carries an accessToken/refreshToken (AC8) -- see api-contract-draft.md "Auth". */
export type SignUpResult =
  | { kind: "verification_required"; email: string }
  | { kind: "parental_consent_required"; accountClass: AccountClass; consentRequestId: string };

export type ChallengeKind = "email_verification" | "new_password_required" | "mfa_totp" | "mfa_sms";

export interface ChallengeAnswerRequest {
  challengeToken: string;
  kind: ChallengeKind;
  answer: string;
}

/**
 * Sign-in-time result (`POST /auth/sign-in` and `POST /auth/challenge`) --
 * distinct from `SignUpResult`. `user`/`capabilities` are left as opaque
 * records here: their full schemas are outside this story's acceptance
 * criteria.
 */
export type SignInResult =
  | { kind: "authenticated"; user: Record<string, unknown>; capabilities: Record<string, unknown> }
  | { kind: "challenge"; challenge: { kind: ChallengeKind }; challengeToken: string };

type ValidationFailure = { ok: false; kind: "validation_failed"; field: string; message: string };
type UnsupportedAuthMethodFailure = { ok: false; kind: "unsupported_auth_method"; message: string };
type SignUpValidationFailure = ValidationFailure | UnsupportedAuthMethodFailure;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_OF_BIRTH_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const PASSWORD_MIN_LENGTH = 12;

export const UNSUPPORTED_AUTH_METHOD_MESSAGE =
  "This request included a federated provider token or phone number as the identity mechanism. Only email and password sign-in is supported.";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasUnsupportedAuthMethodField(body: Record<string, unknown>): boolean {
  return "providerToken" in body || "phoneNumber" in body;
}

function isDateOfBirthWellFormed(dateOfBirth: unknown): dateOfBirth is string {
  if (typeof dateOfBirth !== "string" || !DATE_OF_BIRTH_PATTERN.test(dateOfBirth)) return false;
  const date = new Date(`${dateOfBirth}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;
  if (date.getTime() > Date.now()) return false;
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

export function isPasswordPolicyCompliant(password: unknown): password is string {
  if (typeof password !== "string") return false;
  if (password.length < PASSWORD_MIN_LENGTH) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

export function validateSignUpRequest(
  body: unknown,
): { ok: true; value: SignUpRequest } | SignUpValidationFailure {
  if (!isPlainObject(body)) {
    return { ok: false, kind: "validation_failed", field: "body", message: "Request body must be an object." };
  }
  if (hasUnsupportedAuthMethodField(body)) {
    return { ok: false, kind: "unsupported_auth_method", message: UNSUPPORTED_AUTH_METHOD_MESSAGE };
  }
  if (typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email)) {
    return { ok: false, kind: "validation_failed", field: "email", message: "Enter a valid email address." };
  }
  if (typeof body.displayName !== "string" || body.displayName.trim().length === 0) {
    return { ok: false, kind: "validation_failed", field: "displayName", message: "displayName is required." };
  }
  if (!isPasswordPolicyCompliant(body.password)) {
    return {
      ok: false,
      kind: "validation_failed",
      field: "password",
      message:
        "Password must be at least 12 characters and include an uppercase letter, a lowercase letter, and a number.",
    };
  }
  if (!isDateOfBirthWellFormed(body.dateOfBirth)) {
    return {
      ok: false,
      kind: "validation_failed",
      field: "dateOfBirth",
      message: "Enter a valid date of birth that isn't in the future.",
    };
  }

  const value: SignUpRequest = {
    email: body.email,
    password: body.password,
    displayName: body.displayName,
    dateOfBirth: body.dateOfBirth,
  };
  if (typeof body.inviteToken === "string") value.inviteToken = body.inviteToken;

  return { ok: true, value };
}

export function validateSignInRequest(
  body: unknown,
): { ok: true; value: SignInRequest } | ValidationFailure | UnsupportedAuthMethodFailure {
  if (!isPlainObject(body)) {
    return { ok: false, kind: "validation_failed", field: "body", message: "Request body must be an object." };
  }
  if (hasUnsupportedAuthMethodField(body)) {
    return { ok: false, kind: "unsupported_auth_method", message: UNSUPPORTED_AUTH_METHOD_MESSAGE };
  }
  if (typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email)) {
    return { ok: false, kind: "validation_failed", field: "email", message: "Enter a valid email address." };
  }
  if (typeof body.password !== "string" || body.password.length === 0) {
    return { ok: false, kind: "validation_failed", field: "password", message: "password is required." };
  }
  return { ok: true, value: { email: body.email, password: body.password } };
}
