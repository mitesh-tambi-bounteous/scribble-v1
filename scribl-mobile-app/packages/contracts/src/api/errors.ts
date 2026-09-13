/**
 * The documented 11-code `ErrorCode` union (api-contract-draft.md "Common
 * errors"), plus four codes this story adds to close a real gap: the draft
 * has no code for an unsupported auth method and collapses confirm-email
 * lockout / resend-cooldown / resend-limit into one generic `rate_limited`.
 * Flagged for architect sign-off in the story's open questions.
 */
export const ERROR_CODES = [
  "unauthenticated",
  "forbidden",
  "submission_required",
  "parental_consent_required",
  "not_found",
  "validation_failed",
  "conflict",
  "rate_limited",
  "invite_invalid",
  "invite_expired",
  "internal",
  "unsupported_auth_method",
  "confirm_email_locked",
  "resend_cooldown",
  "resend_limit_reached",
  "payload_too_large",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export function isErrorCode(value: string): value is ErrorCode {
  return (ERROR_CODES as readonly string[]).includes(value);
}

export const ERROR_STATUS: Record<ErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  submission_required: 403,
  parental_consent_required: 403,
  not_found: 404,
  validation_failed: 422,
  conflict: 409,
  rate_limited: 429,
  invite_invalid: 404,
  invite_expired: 410,
  internal: 500,
  unsupported_auth_method: 400,
  confirm_email_locked: 429,
  resend_cooldown: 429,
  resend_limit_reached: 429,
  payload_too_large: 413,
};

export interface ErrorEnvelope {
  code: ErrorCode;
  message: string;
  correlationId: string;
}
