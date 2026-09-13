import { randomUUID } from "node:crypto";
import {
  validateSignUpRequest,
  type SignUpResult,
} from "../../../../packages/contracts/src/api/auth.ts";
import {
  classifyAccountAge,
  canProceedToAccountCreation,
  allowsMinorEnrollment,
  type AppEnv,
} from "../../../../packages/contracts/src/domain/account-class.ts";
import type { ErrorCode } from "../../../../packages/contracts/src/api/errors.ts";
import type { AuthAdapter } from "./adapters/types.ts";

export interface AuthServiceDeps {
  adapter: AuthAdapter;
  appEnv: AppEnv;
}

export type ServiceFailure = { ok: false; code: ErrorCode; field?: string; message: string };
export type ServiceResult<T> = { ok: true; value: T } | ServiceFailure;

export async function signUp(
  body: unknown,
  deps: AuthServiceDeps,
): Promise<ServiceResult<SignUpResult>> {
  const validation = validateSignUpRequest(body);
  if (!validation.ok) {
    return validation.kind === "unsupported_auth_method"
      ? { ok: false, code: "unsupported_auth_method", message: validation.message }
      : { ok: false, code: "validation_failed", field: validation.field, message: validation.message };
  }
  const { value } = validation;

  const existing = await deps.adapter.findUserByEmail(value.email);
  if (existing) {
    return {
      ok: false,
      code: "conflict",
      message: "This email is already registered. Sign in instead.",
    };
  }

  const accountClass = classifyAccountAge(value.dateOfBirth);

  if (canProceedToAccountCreation(accountClass)) {
    await deps.adapter.createUser({
      email: value.email,
      password: value.password,
      displayName: value.displayName,
      dateOfBirth: value.dateOfBirth,
      accountClass,
    });
    await deps.adapter.requestConfirmationCode(value.email);
    return { ok: true, value: { kind: "verification_required", email: value.email } };
  }

  // accountClass is "minor" (or, defensively, "unknown" -- ADR-0012 treats
  // unknown as minor everywhere downstream). ADR-0012 "Option A": no
  // minor-enrollment path exists yet, so no account is created regardless
  // of `allowsMinorEnrollment(deps.appEnv)`; that flag is the named switch
  // this call site would branch on once the pending sub-decisions close.
  void allowsMinorEnrollment(deps.appEnv);
  const consentRequestId = `consent_${randomUUID()}`;
  return {
    ok: true,
    value: {
      kind: "parental_consent_required",
      accountClass: accountClass === "unknown" ? "minor" : accountClass,
      consentRequestId,
    },
  };
}

export interface ConfirmEmailSuccess {
  sessionId: string;
  accessToken: string;
}

export async function confirmEmail(
  body: unknown,
  deps: AuthServiceDeps,
): Promise<ServiceResult<ConfirmEmailSuccess>> {
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).email !== "string" ||
    typeof (body as Record<string, unknown>).code !== "string"
  ) {
    return { ok: false, code: "validation_failed", field: "code", message: "email and code are required." };
  }
  const { email, code } = body as { email: string; code: string };

  const outcome = await deps.adapter.confirmEmail(email, code);
  if (outcome.outcome === "success") {
    return { ok: true, value: { sessionId: outcome.sessionId, accessToken: outcome.accessToken } };
  }
  if (outcome.outcome === "locked") {
    return {
      ok: false,
      code: "confirm_email_locked",
      message: "You've reached the limit of failed codes. Try again after the cooldown.",
    };
  }
  return {
    ok: false,
    code: "validation_failed",
    field: "code",
    message: "That code isn't right. No session has been created.",
  };
}

export async function resendConfirmation(
  body: unknown,
  deps: AuthServiceDeps,
): Promise<ServiceResult<Record<string, never>>> {
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).email !== "string"
  ) {
    return { ok: false, code: "validation_failed", field: "email", message: "email is required." };
  }
  const { email } = body as { email: string };

  const outcome = await deps.adapter.resendConfirmationCode(email);
  if (outcome.outcome === "sent") {
    return { ok: true, value: {} };
  }
  if (outcome.outcome === "cooldown") {
    return {
      ok: false,
      code: "resend_cooldown",
      message: "Please wait for the cooldown to end before requesting another code.",
    };
  }
  return {
    ok: false,
    code: "resend_limit_reached",
    message: "You've used all your code resends for this hour.",
  };
}
