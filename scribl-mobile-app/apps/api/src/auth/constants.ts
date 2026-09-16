// Numeric thresholds are not specified anywhere in the docs (see the story's
// open questions); named here so behaviour is overridable and testable
// rather than hardcoded inline.
export const CONFIRM_EMAIL_MAX_ATTEMPTS = 5;
export const CONFIRM_EMAIL_LOCKOUT_MS = 15 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 60 * 1000;
export const RESEND_LIMIT_PER_WINDOW = 3;
export const RESEND_WINDOW_MS = 60 * 60 * 1000;

// AC11 requires POST /auth/sign-up to state plainly that an email is already
// registered -- security_review flagged that as an enumeration vector. The
// per-client throttle below is the mitigation: it doesn't change what the
// response says (that's the AC), it bounds how many emails a single client
// can probe per window.
export const SIGN_UP_RATE_LIMIT_MAX_ATTEMPTS = 20;
export const SIGN_UP_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
