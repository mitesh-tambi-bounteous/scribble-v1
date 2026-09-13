import type {
  SignUpRequest,
  SignUpResult,
  ConfirmEmailRequest,
  ChallengeAnswerRequest,
  SignInResult,
} from "../../../../../../packages/contracts/src/api/auth.ts";
import { AuthApiError, type AuthAdapter } from "../types.ts";

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

export interface LocalAuthAdapterOptions {
  baseUrl: string;
  fetchFn?: FetchFn;
}

async function postJson<T>(fetchFn: FetchFn, url: string, body: unknown): Promise<T> {
  const response = await fetchFn(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await response.json()) as Record<string, unknown>;
  if (response.status < 200 || response.status >= 300) {
    throw new AuthApiError(
      typeof json.code === "string" ? json.code : "internal",
      typeof json.message === "string" ? json.message : "Request failed.",
      typeof json.field === "string" ? json.field : undefined,
    );
  }
  return json as T;
}

/** Talks to our own Nest-owned `/auth/*`, never to Cognito directly. */
export class LocalAuthAdapter implements AuthAdapter {
  private readonly baseUrl: string;
  private readonly fetchFn: FetchFn;

  constructor(options: LocalAuthAdapterOptions) {
    this.baseUrl = options.baseUrl;
    this.fetchFn = options.fetchFn ?? fetch;
  }

  async signUp(input: SignUpRequest): Promise<SignUpResult> {
    return postJson<SignUpResult>(this.fetchFn, `${this.baseUrl}/auth/sign-up`, input);
  }

  async confirmEmail(input: ConfirmEmailRequest): Promise<void> {
    await postJson(this.fetchFn, `${this.baseUrl}/auth/confirm-email`, input);
  }

  async resendConfirmation(input: { email: string }): Promise<void> {
    await postJson(this.fetchFn, `${this.baseUrl}/auth/confirm-email/resend`, input);
  }

  async answerChallenge(input: ChallengeAnswerRequest): Promise<SignInResult> {
    return postJson<SignInResult>(this.fetchFn, `${this.baseUrl}/auth/challenge`, input);
  }
}
