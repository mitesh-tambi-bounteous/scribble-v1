// Numeric thresholds are not specified anywhere in the docs (see the story's
// open questions); named here so behaviour is overridable and testable
// rather than hardcoded inline.
export const CONFIRM_EMAIL_MAX_ATTEMPTS = 5;
export const CONFIRM_EMAIL_LOCKOUT_MS = 15 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 60 * 1000;
export const RESEND_LIMIT_PER_WINDOW = 3;
export const RESEND_WINDOW_MS = 60 * 60 * 1000;
