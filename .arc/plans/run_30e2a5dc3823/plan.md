summary: |
  Implement SCRIBBLE-V2-STORY-001 (email/password sign-up with COPPA age-gating
  and email verification) test-first, against the documented v3 API contract
  (`meta-scribble-app/handbook/engineering/data-and-api/api-contract-draft.md`),
  ADR-0012's age-gate/consent design, and the approved 8-screen prototype at
  `.arc/designs/SCRIBBLE-V2-STORY-001-design.html`. Direct filesystem inspection
  of this worktree confirms only two top-level folders exist today:
  `meta-scribble-app/` (the project's docs/decisions/brain, per the user's
  explicit instruction never a destination for implementation code) and
  `design-system/` (a small prior chore, SCRIBBLE-V2-CHORE-005: design tokens
  and a style guide, no application code). There is no `packages/`, `apps/`,
  or any pnpm workspace anywhere in this worktree. That means every file
  ADR-0012 and the api-contract-draft describe as "already shipped" in
  `ScriblOrg/scribl-mobile-app` (account-class.ts, ParentalConsentScreen,
  RequiredConsentGate, app/sign-up.tsx, packages/contracts, @scribl/mock-server)
  describes a separate GitHub repo that is not vendored into this worktree, not
  code this plan can read, modify, or assume the shape of. Per the user's
  explicit instruction, all real implementation goes in a new top-level folder
  parallel to `meta-scribble-app/`, named `scribl-mobile-app/` to match the
  `build_repo.slug` already recorded in `meta-scribble-app/project.json`. Per
  the user's latest instruction this turn, `design-system/` is also being
  relocated to live under that same folder (`scribl-mobile-app/design-system/`)
  rather than staying a separate top-level sibling, so that everything
  implementation-adjacent -- app code and the design tokens/style guide alike
  -- lives under the one parallel root, leaving `meta-scribble-app/` as the
  only folder that is purely docs/brain. This plan therefore bootstraps a
  minimal pnpm workspace skeleton there, relocates `design-system/` into it
  unchanged, and builds every file this story needs from scratch (contracts
  schemas, a Nest `apps/api` auth module with a local in-memory adapter doing
  the real work and a Cognito adapter left as an unimplemented seam, and two
  Expo Router mobile screens plus reuse of a parental-consent route), rather
  than "porting" or "reusing" anything, since there is nothing here to port or
  reuse. Every acceptance criterion still gets a failing test first, in the
  layer where it is actually enforced: the local auth adapter and contract
  schemas for the COPPA gate and error taxonomy (server is authoritative,
  never trust the client), UI-level for the two loading-state ACs and for how
  each server error renders.

scope:
  - description: |
      Bootstrap a minimal pnpm workspace skeleton at a new top-level
      `scribl-mobile-app/` folder (sibling to `meta-scribble-app/`, never
      inside it): a root `package.json` + `pnpm-workspace.yaml`, and
      empty-but-wired packages for `packages/contracts`, `apps/api` (Nest),
      and `apps/mobile` (Expo Router), each with its own `package.json`,
      `tsconfig.json`, and a single trivial passing test so Jest runs
      per-project from day one (per
      `meta-scribble-app/handbook/engineering/toolchain.md`: "Jest everywhere,
      two projects").
    files:
      - scribl-mobile-app/package.json
      - scribl-mobile-app/pnpm-workspace.yaml
      - scribl-mobile-app/packages/contracts/package.json
      - scribl-mobile-app/apps/api/package.json
      - scribl-mobile-app/apps/mobile/package.json
    rationale: |
      Confirmed by direct directory listing that no application code exists
      anywhere in this worktree; every scope item below needs somewhere to
      live before its own first failing test can even fail to compile. This
      replaces the previous plan's scope item 1 ("confirm the real repo's file
      layout"), which assumed a checked-out `ScriblOrg/scribl-mobile-app` repo
      might exist somewhere reachable; it does not, so there is nothing to
      verify, only something to create, per the user's explicit instruction to
      keep implementation out of `meta-scribble-app/` and in a parallel folder.

  - description: |
      Relocate the existing `design-system/` folder (tokens.json, tokens.css,
      style-guide.html, prototype-utils.css, .contrast_check.py) from the
      worktree root to `scribl-mobile-app/design-system/`, as a plain move --
      contents unchanged, including its known placeholder palette and its
      `[object Object]` token-generation bug (see open questions). Update any
      relative links inside `style-guide.html` that assumed root-level
      siblings, if any exist, so the moved copy still opens standalone.
    files:
      - scribl-mobile-app/design-system/tokens.json
      - scribl-mobile-app/design-system/tokens.css
      - scribl-mobile-app/design-system/style-guide.html
      - scribl-mobile-app/design-system/prototype-utils.css
      - scribl-mobile-app/design-system/.contrast_check.py
    rationale: |
      Per the user's latest instruction: `design-system/` moves inside
      `scribl-mobile-app/` rather than staying a top-level sibling, so that
      `meta-scribble-app/` is the only folder that is purely docs/brain and
      every implementation-adjacent artifact (app code and design tokens
      alike) lives under the one parallel root. Done as its own scope item,
      separate from the pnpm-workspace bootstrap above, since it is a
      content-preserving relocation, not new code, and should be reviewable
      (and revertable) independently of the workspace scaffold.

  - description: |
      Write the shared contract module: sign-up/confirm-email/resend request
      and result schemas, the error-taxonomy additions this story needs
      (`unsupported_auth_method`, and a way to distinguish confirm-email
      lockout vs. resend-cooldown vs. resend-limit, since today's documented
      11-code `ErrorCode` union collapses all three into one generic
      `429 rate_limited`), and the COPPA age-gate as its own pure module:

      ```ts
      // scribl-mobile-app/packages/contracts/src/domain/account-class.ts
      export type AccountClass = "adult" | "minor" | "unknown";
      export const COPPA_AGE_THRESHOLD = 13;

      export function classifyAccountAge(
        dateOfBirth: string,
        now: Date = new Date(),
      ): AccountClass;

      export function canProceedToAccountCreation(
        accountClass: AccountClass,
      ): boolean; // true only for "adult"

      export function allowsMinorEnrollment(
        appEnv: "dev" | "qa" | "prod",
      ): boolean; // false for "prod", per ADR-0012 "Option A"
      ```
    files:
      - scribl-mobile-app/packages/contracts/src/api/auth.ts
      - scribl-mobile-app/packages/contracts/src/api/errors.ts
      - scribl-mobile-app/packages/contracts/src/domain/account-class.ts
    rationale: |
      `packages/contracts` is documented as the single Zod source of truth
      every layer validates against (api-contract-draft.md "Where this
      contract lives"); every endpoint and UI task below depends on these
      shapes existing first. ADR-0012 describes `account-class.ts` and its
      `COPPA_AGE_THRESHOLD = 13` / `unknown`-treated-as-`minor` / fail-closed
      behavior in detail, but only as code living in a repo this worktree does
      not have -- so this is a fresh implementation of that documented design,
      not a port, and it is placed in `packages/contracts` (not
      `apps/mobile/src/lib/` as ADR-0012's citation implies) specifically so
      `apps/api` can enforce it server-side without duplicating it, since the
      sign-up contract requires the server to be authoritative (a minor must
      never reach account creation regardless of client input).

  - description: |
      Implement the `apps/api` Nest auth module: `POST /auth/sign-up`,
      `POST /auth/confirm-email`, `POST /auth/confirm-email/resend`, each
      backed by a real, fully-tested **local** adapter (in-memory user store,
      deterministic fake email codes, in-process attempt/cooldown counters),
      plus a **Cognito** adapter that only implements the same TypeScript
      interface with each method throwing `NotImplementedError` for now. Also
      reject federated-token/phone-number payloads on sign-up and sign-in, and
      let unmapped routes (`/auth/federated/*`, `/auth/sign-up/phone`) fall
      through to a global 404 handler shaped like the contract's `not_found`
      envelope.
    files:
      - scribl-mobile-app/apps/api/src/auth/auth.controller.ts
      - scribl-mobile-app/apps/api/src/auth/auth.service.ts
      - scribl-mobile-app/apps/api/src/auth/adapters/local.ts
      - scribl-mobile-app/apps/api/src/auth/adapters/cognito.ts
      - scribl-mobile-app/apps/api/src/auth/adapters/types.ts
    rationale: |
      Decision register 6.1 ("everything external sits behind an adapter with
      a local default... the factory throws on an unrecognised value rather
      than falling back") is the load-bearing pattern here: the local adapter
      is not a throwaway mock, it is the real, fully-tested implementation
      that every one of this story's 18 ACs can be proven against without an
      AWS credential, and the Cognito adapter is deliberately left as a stub
      seam rather than built out, since real Cognito provisioning is E01-F1
      ("AWS accounts and three environments"), currently "Blocked" per
      `docs/epics/e01.md` and out of scope for this story. This also folds in
      what an earlier pass of this plan scoped as a separate
      `@scribl/mock-server` task: since `apps/api` itself doesn't exist yet
      either, standing up a second fixture server before the real one adds
      duplicate logic for no benefit here -- flagged as a deviation from the
      documented dev topology in the open questions below.

  - description: |
      Extend the local-vs-Cognito adapter conformance check: one shared test
      suite exercised against both adapters (skipping/xfailing the Cognito
      cases with a clear reason string until E01-F1 unblocks it), asserting
      both would produce identical response shapes and error codes off the
      same `packages/contracts` schemas.
    files:
      - scribl-mobile-app/apps/api/src/auth/__conformance__/auth.conformance.spec.ts
    rationale: |
      Named as E01-F5's acceptance criterion in api-contract-draft.md
      ("Contract conformance"); adapted here to run against the two adapters
      instead of "mock server vs. real API" per the deviation above, so the
      same drift-prevention intent still holds without a redundant server.

  - description: |
      Build the mobile `services/auth` seam (interface + local/Cognito
      adapters calling the new HTTP endpoints), and assert confirm-email never
      touches the sign-in-time challenge path:

      ```ts
      // scribl-mobile-app/apps/mobile/src/services/auth/types.ts
      export interface AuthAdapter {
        signUp(input: SignUpRequest): Promise<SignUpResult>;
        confirmEmail(input: ConfirmEmailRequest): Promise<void>;
        resendConfirmation(input: { email: string }): Promise<void>;
        answerChallenge(input: ChallengeAnswer): Promise<SignInResult>;
      }
      ```
    files:
      - scribl-mobile-app/apps/mobile/src/services/auth/types.ts
      - scribl-mobile-app/apps/mobile/src/services/auth/adapters/local.ts
      - scribl-mobile-app/apps/mobile/src/services/auth/adapters/cognito.ts
    rationale: |
      service-seams.md's pattern (one interface, adapters named for the
      vendor, a factory that is the only module allowed to import an adapter)
      is the convention to build to, even though none of it exists yet in
      this worktree. Putting `answerChallenge` in the same interface as
      `confirmEmail` is what makes AC7 a cheap, precise spy-based test: assert
      the mock `answerChallenge` is never called during a `confirmEmail` flow.

  - description: |
      Build the sign-up screen from scratch as an Expo Router route, per
      design Screens 1 (default), 2 (submitting), and 7 (validation errors):
      email/password/displayName/dateOfBirth fields in that order, a single
      full-width primary button labelled "Create account", a divider
      ("already have an account?") and a "Sign in instead" link below it, a
      generic top-of-form error-banner slot for any error the three named
      fields don't own (this is what makes AC10's defensive display "free"
      without the UI ever constructing a federated-token/phone payload
      itself), and per-field inline errors for `dateOfBirth` (AC4), `password`
      (AC12), and `email` (AC11, with an inline "Sign in instead" link inside
      the field error per Screen 7's `err-email-msg` markup).
    files:
      - scribl-mobile-app/apps/mobile/app/sign-up.tsx
    rationale: |
      `docs/design/screen-flow-inventory.md` documents a `/sign-up` route
      that "carries sign-up, log-in and an existing-user picker" -- but that
      finding describes the separate `ScriblOrg/scribl-mobile-app` repo, which
      is not in this worktree, so there is no existing file to modify here.
      This is new code, written to match that same route shape and the
      design's exact card layout (eyebrow / h1 "Join Scribl" / subtitle / four
      fields / button / divider / sign-in link) so it still lines up with the
      documented product route map.

  - description: |
      Build a new email-verification screen per design Screens 3 and 4:
      avatar-circle showing the display name's first initial, a 6-digit code
      input (`inputmode="numeric"`, `maxlength=6`), a "Confirm and continue"
      button, a resend row ("Didn't get it? Resend code"), and the five
      toolbar-selectable states from the design (default, wrong code /AC6/,
      lockout /AC13/, resend-cooldown /AC16/, resend-limit /AC17-18/), each
      rendering the banner copy and disabled-control combination the design
      specifies for that state (e.g. lockout disables both the code input and
      submit button; resend-cooldown and resend-limit both disable only the
      resend link).
    files:
      - scribl-mobile-app/apps/mobile/app/verify-email.tsx
    rationale: |
      AC5, AC6, AC7, AC13, AC16, AC17, AC18 all live on this screen. It is
      unambiguously new: `screen-flow-inventory.md`'s 27-screen audit (of the
      other repo) lists no verify/confirm route at all, so even under the
      "already shipped elsewhere" reading this specific screen would still be
      new work, independent of the this-worktree-is-empty finding above.

  - description: |
      Build the parental-consent-required screen/route, matching design
      Screen 6's copy ("Let's bring in a parent or guardian" / "No account
      has been created yet") and its kv-list (email submitted, consent
      request id, status "Not started"), wired to the sign-up screen's
      `parental_consent_required` branch.
    files:
      - scribl-mobile-app/apps/mobile/app/(auth)/parental-consent.tsx
    rationale: |
      ADR-0012 names `ParentalConsentScreen`, `ParentControlsScreen`, and
      `RequiredConsentGate` as already built and wired at this same route path
      in the separate repo -- but, as with the sign-up screen above, that repo
      is not here, so this is a fresh build to the same route convention and
      the design's exact copy/kv-list, not a modification.

  - description: |
      Add a minimal post-verification landing: on a correct
      `POST /auth/confirm-email`, route to a small existing-session-confirmed
      state (per design Screen 5's banner "Email verified" / "Welcome to
      Scribl, {name}" / "Go to today's prompt" button) that hands off to a
      `postAuthRoute()` decision function, itself new. The CTA's destination
      (today's actual prompt/home screen) is an out-of-scope stub route for
      this story -- building the daily-prompt screen belongs to RE-03, a
      separate epic.
    files:
      - scribl-mobile-app/apps/mobile/src/lib/postAuthRoute.ts
      - scribl-mobile-app/apps/mobile/app/verify-email.tsx
    rationale: |
      AC5 only requires arriving at an authenticated session; it does not
      require the daily-prompt home screen to exist. Building only the
      confirmation state plus a routing decision point, and stubbing its
      onward destination, keeps this task inside AC5 instead of speculatively
      building unrelated future-epic screens.

tests:
  - |
    AC1: `apps/api` auth.service test -- an adult dateOfBirth returns
    `verification_required`.
    ```ts
    const res = await signUp({ email: "a@example.com", password: "Str0ngPass1", displayName: "A", dateOfBirth: "1990-04-12" });
    expect(res).toEqual({ kind: "verification_required", email: "a@example.com" });
    ```
  - |
    AC2: same layer -- a minor dateOfBirth returns `parental_consent_required`.
    ```ts
    const res = await signUp({ email: "kid@example.com", password: "Str0ngPass1", displayName: "Kid", dateOfBirth: "2016-01-01" });
    expect(res).toMatchObject({ kind: "parental_consent_required", accountClass: "minor" });
    expect(res.consentRequestId).toEqual(expect.any(String));
    ```
  - |
    AC3: `apps/api` integration test against the local adapter with
    `allowsMinorEnrollment("prod")` forced -- no user is created for a minor.
    ```ts
    const createUserSpy = jest.spyOn(localAdapter, "createUser");
    await signUp({ email: "kid2@example.com", password: "Str0ngPass1", displayName: "Kid", dateOfBirth: "2016-01-01" }, { appEnv: "prod" });
    expect(createUserSpy).not.toHaveBeenCalled();
    ```
  - |
    AC4: contract + service test -- an unparseable date and a future date each
    fail on the `dateOfBirth` field specifically, never resolving to either
    discriminated kind.
    ```ts
    for (const dateOfBirth of ["not-a-date", "2099-01-01"]) {
      const res = await request(app).post("/auth/sign-up").send({ ...validBody, dateOfBirth });
      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({ code: "validation_failed" });
      expect(res.body.message).toMatch(/dateOfBirth/i);
    }
    ```
  - |
    AC5: `apps/api` e2e -- correct code after `verification_required` produces
    an authenticated session.
    ```ts
    await signUp(adultBody);
    const res = await confirmEmail({ email: adultBody.email, code: FIXED_TEST_CODE });
    expect(res.status).toBe(200);
    expect(sessionStoreFor(adultBody.email)).toBeDefined();
    ```
  - |
    AC6: `apps/api` e2e -- an incorrect code creates no session.
    ```ts
    await signUp(adultBody);
    const res = await confirmEmail({ email: adultBody.email, code: "000000" });
    expect(res.status).not.toBe(200);
    expect(sessionStoreFor(adultBody.email)).toBeUndefined();
    ```
  - |
    AC7: seam-level spy test -- confirming email never calls the sign-in-time
    challenge path.
    ```ts
    const challengeSpy = jest.spyOn(localAdapter, "answerChallenge");
    await confirmEmail({ email: adultBody.email, code: FIXED_TEST_CODE });
    expect(challengeSpy).not.toHaveBeenCalled();
    ```
  - |
    AC8: contract + response-shape test -- no sign-up result ever carries a
    token.
    ```ts
    const res = await request(app).post("/auth/sign-up").send(adultBody);
    expect(res.body).not.toHaveProperty("accessToken");
    expect(res.body).not.toHaveProperty("refreshToken");
    ```
  - |
    AC9: route test -- unmapped social/phone paths 404 in the contract's
    envelope shape, not a raw framework 404.
    ```ts
    const res = await request(app).post("/auth/federated/google");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: "not_found" });
    ```
  - |
    AC10: validation test -- a federated-token or phone-number payload is
    rejected with a specific unsupported-method error (see the open question
    on this code/envelope, since design Screen 8's sample response uses a
    different field name than the contract's standard envelope).
    ```ts
    const res = await request(app).post("/auth/sign-up").send({ ...adultBody, providerToken: "abc" });
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ code: "unsupported_auth_method" });
    ```
  - |
    AC11: integration test -- signing up with an already-registered email
    states so and points to sign-in.
    ```ts
    await signUp(adultBody);
    const res = await request(app).post("/auth/sign-up").send(adultBody);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);
    expect(res.body.message).toMatch(/sign in/i);
    ```
  - |
    AC12: test -- a password failing the policy (design's own stated rule:
    12+ chars, upper, lower, number) is rejected scoped to `password`.
    ```ts
    const res = await request(app).post("/auth/sign-up").send({ ...adultBody, password: "hunter2" });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/password/i);
    ```
  - |
    AC13: test against named constants (values TBD, see open questions) --
    reaching the max failed confirm-email attempts locks out further tries
    before the cooldown elapses.
    ```ts
    for (let i = 0; i < CONFIRM_EMAIL_MAX_ATTEMPTS; i++) {
      await confirmEmail({ email: adultBody.email, code: "000000" });
    }
    const res = await confirmEmail({ email: adultBody.email, code: FIXED_TEST_CODE });
    expect(res.status).toBe(429);
    expect(res.body).toMatchObject({ code: "rate_limited" });
    ```
  - |
    AC14: mobile component test -- the submit control disables while
    `POST /auth/sign-up` is in flight.
    ```tsx
    const { getByText, getByTestId } = render(<SignUpScreen />);
    fireEvent.press(getByText("Create account"));
    expect(getByTestId("su-submit-btn").props.accessibilityState.disabled).toBe(true);
    ```
  - |
    AC15: mobile component test -- a loading indicator shows during the same
    in-flight window.
    ```tsx
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText("Create account"));
    expect(getByText(/Creating account/)).toBeTruthy();
    ```
  - |
    AC16: test against a named cooldown constant -- resending before the
    cooldown elapses is rejected.
    ```ts
    await resendConfirmation({ email: adultBody.email });
    const res = await resendConfirmation({ email: adultBody.email });
    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/wait|cooldown/i);
    ```
  - |
    AC17: test against a named per-window resend limit -- reaching it is
    rejected.
    ```ts
    for (let i = 0; i < RESEND_LIMIT_PER_WINDOW; i++) {
      await resendConfirmation({ email: adultBody.email });
      advanceFakeClock(RESEND_COOLDOWN_MS + 1);
    }
    const res = await resendConfirmation({ email: adultBody.email });
    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/limit/i);
    ```
  - |
    AC18: same reached-limit scenario as AC17 -- assert no further code was
    actually dispatched.
    ```ts
    const sendCodeSpy = jest.spyOn(localAdapter, "sendConfirmationEmail");
    const callsBeforeLimitHit = sendCodeSpy.mock.calls.length;
    await resendConfirmation({ email: adultBody.email }); // the one that hits the limit
    expect(sendCodeSpy.mock.calls.length).toBe(callsBeforeLimitHit);
    ```

assumptions_or_open_questions:
  - |
    Confirmed by direct directory listing this session: this worktree
    contains only `meta-scribble-app/` (docs/brain) and `design-system/` (a
    prior tokens/style-guide chore, being relocated per this turn). No
    `packages/`, `apps/`, pnpm workspace, or any application code exists
    anywhere here. Per the user's explicit instruction, all implementation in
    this plan targets a new top-level folder, `scribl-mobile-app/`, and
    `design-system/` now moves inside it too, so `meta-scribble-app/` remains
    the only purely-docs folder.
  - |
    The `scribl-mobile-app/` folder name is this plan's choice, not something
    the user stated directly -- grounded in `meta-scribble-app/project.json`'s
    `build_repo.slug: "ScriblOrg/scribl-mobile-app"` (the name the rest of the
    docs already use for this codebase), rather than the older, seemingly
    stale `hs2studio/scribl-app` name `CLAUDE.md` still cites as `code_repo`.
    Flagging the name choice for explicit confirmation.
  - |
    `design-system/` is relocated to `scribl-mobile-app/design-system/` as a
    plain top-level child, matching exactly what the user said ("moved inside
    scribl-mobile-app folder"). Whether it should instead become a proper
    pnpm workspace package (e.g. `scribl-mobile-app/packages/design-system`)
    so `apps/mobile` can import its tokens directly, versus staying a static
    asset folder outside the workspace's package graph, is left open --
    nothing in this story's ACs requires the mobile app to consume it
    programmatically yet, so this plan does not force that decision.
  - |
    Because nothing exists here, everything ADR-0012 and the API contract
    draft describe as "already shipped" (account-class.ts, ParentalConsentScreen,
    RequiredConsentGate, app/sign-up.tsx, packages/contracts, @scribl/mock-server)
    is treated in this plan as a **design spec to implement fresh**, not
    existing code to port or modify. Every scope item above is phrased as a
    new file for this reason. If a real, separate `ScriblOrg/scribl-mobile-app`
    checkout becomes available before this work starts, re-verify each path
    against it first and convert the matching scope items from "build new" to
    "modify existing."
  - |
    Deviated from the previously-documented dev topology by not building a
    separate `@scribl/mock-server`: since `apps/api` itself is also new here,
    this plan gives `apps/api` a real local adapter (in-memory, no AWS
    credential, per decision register 6.1's "local adapter that is genuinely
    useful, not a no-op") instead of standing up a second fixture server that
    would duplicate the same logic. Flagged for reviewer sign-off since it
    departs from the literal "mobile talks to @scribl/mock-server on :4000"
    pattern the contract draft describes for the other repo.
  - |
    Real AWS Cognito integration is out of scope for this story's tests: E01-F1
    ("AWS accounts and three environments") is documented as "Blocked", so the
    Cognito adapter is built only as a same-interface stub (throws
    `NotImplementedError`), never exercised by a passing test that requires
    real AWS. The password policy, lockout, and resend-limit behavior this
    story's ACs require are implemented and tested entirely in the local
    adapter.
  - |
    Exact Cognito password-policy character-class requirements beyond "12+
    characters" are not stated in the contract draft or ADR-0012; taken from
    the design's own copy (Screen 1's hint and Screen 7's error message: 12+
    chars, upper, lower, number) as the working definition for the local
    adapter's policy check, pending confirmation against a real Cognito user
    pool policy once E01-F1 unblocks.
  - |
    Numeric thresholds for confirm-email max failed attempts + lockout
    duration, resend cooldown, and resend limit-per-window are not specified
    anywhere in the docs; the design's on-screen countdowns (14:52, 0:47,
    42:10) are explicitly illustrative review copy, not a spec. Tests are
    written against named, overridable constants (`CONFIRM_EMAIL_MAX_ATTEMPTS`,
    `CONFIRM_EMAIL_LOCKOUT_MS`, `RESEND_COOLDOWN_MS`, `RESEND_LIMIT_PER_WINDOW`,
    `RESEND_WINDOW_MS`) rather than these literal values.
  - |
    The documented 11-code `ErrorCode` union has no code for "unsupported auth
    method", no dedicated code for "email already registered" (this plan
    defaults to reusing `409 conflict`), and no way to distinguish
    confirm-email lockout / resend-cooldown / resend-limit from a generic
    `429 rate_limited`. This is a real contract gap this story must close,
    flagged for architect sign-off.
  - |
    Design Screen 8's simulated unsupported-auth-method response,
    `{ "error": "unsupported_auth_method", "message": "..." }`, uses a
    different envelope shape (`error` key) than the contract's standard
    `{ code, message, correlationId }` envelope used everywhere else. Flagging
    this as a conflict between the approved mockup and the documented error
    contract rather than silently picking one -- this plan assumes the real
    response uses the standard envelope with `code: "unsupported_auth_method"`,
    treating Screen 8's JSON as illustrative shorthand, not a literal spec.
  - |
    Design Screen 1's fixture/default password value
    ("correct-horse-battery-staple" -- all lowercase, no digits) does not
    itself satisfy the password policy stated on the design's own Screen 7
    (requires uppercase, lowercase, and a number). This is an internal
    inconsistency in the approved mockup; tests use a policy-conformant
    fixture password instead of copying that literal value.
  - |
    `design-system/tokens.css` (from SCRIBBLE-V2-CHORE-005, moving to
    `scribl-mobile-app/design-system/tokens.css` per this turn) is a generic
    placeholder palette (Inter font, `#2563eb` blue primary, neutral grays) --
    it does not match this story's approved brand palette (warm cream
    `#FBF7F1` background, `#E0632A` brand orange, Nunito Sans / Fraunces,
    read directly from `.arc/designs/SCRIBBLE-V2-STORY-001-design.html`'s own
    `:root` custom properties). This plan's two new screens use the values
    read from the approved sign-up prototype, not `design-system/tokens.css`,
    since reconciling the two token sets is a separate design-system decision
    outside this story. Also noting, without any fix proposed here since it is
    out of scope: `design-system/tokens.css` has a generation bug -- most
    values literally render as the string `[object Object]` (e.g.
    `--color-bg: [object Object];`), so it would not produce valid CSS if
    consumed as-is today. The relocation in scope above moves this folder
    as-is; it does not fix the bug or reconcile the palette.
  - |
    Design Screen 5 ("Authenticated (success)") is annotated as a distinct
    terminal state; since no home/daily-prompt screen exists in this
    worktree either, this plan builds only a minimal confirmation state plus
    a `postAuthRoute()` decision point, with the actual onward destination
    stubbed and explicitly left to a future, separate story (RE-03 daily
    prompt).
  - |
    Design Screen 8 ("Reference -- auth methods not offered") is explicitly
    annotated as "not a real user-facing screen; a sign-off aid" -- no UI task
    in this plan builds it; it only substantiates the AC9/AC10 backend tests.

notes: |
  Grounding: `meta-scribble-app/handbook/engineering/data-and-api/api-contract-draft.md`
  (v3.4) is the authoritative wire contract for /auth/sign-up, /auth/confirm-email,
  /auth/confirm-email/resend, and /auth/challenge (the sign-in-time endpoint AC7
  must never call). ADR-0012 and decision-register 3.1/6.1/7.1/7.2 establish:
  Cognito-managed pool, email/password only (register 3.1); the age-gate/
  account-class mechanism, consent-as-versioned-rows, and
  `allowsMinorEnrollment`'s prod=false posture (ADR-0012, register 7.1/7.2);
  everything vendor-specific lives behind a seam with a local default (register
  6.1, service-seams.md). Repo topology, reconfirmed this session by direct
  listing: this worktree holds only `meta-scribble-app/` (docs/brain) and
  `design-system/` (tokens/style-guide chore, moving inside `scribl-mobile-app/`
  per this turn's instruction); the real `ScriblOrg/scribl-mobile-app` build
  repo (per `meta-scribble-app/project.json`) is not checked out here, so this
  plan creates a new `scribl-mobile-app/` folder from scratch rather than
  modifying anything, per the user's explicit instruction to keep
  `meta-scribble-app/` untouched. Test tooling per
  `handbook/engineering/toolchain.md`: Jest for both the backend and Expo app
  (two projects, one runner); native e2e (Maestro) is explicitly deferred and
  out of scope here. Design fidelity: both new mobile screens cite the exact
  design screen(s) and elements read from
  `.arc/designs/SCRIBBLE-V2-STORY-001-design.html` -- field list and order,
  button/copy text, field-scoped vs. banner-level error placement, and the
  five state-toolbar variants on the verify screen. Two genuine conflicts
  between the approved mockup and the acceptance criteria/contract are called
  out rather than silently resolved (see open questions): Screen 8's
  non-standard error envelope, and Screen 1's policy-violating fixture
  password. A third finding: `design-system/tokens.css`'s placeholder palette
  does not match the sign-up prototype's approved brand colors and has a live
  generation bug, noted but explicitly not fixed by the relocation in this
  plan since it belongs to a different chore.

  ```mermaid
  flowchart TD
    classDef touched fill:#f96,color:#000
    classDef context fill:#eee,color:#555,stroke-dasharray: 3 3

    AccountClass["packages/contracts/src/domain/account-class.ts<br/>(new: age-gate logic)"]:::touched
    ContractsAuth["packages/contracts/src/api/auth.ts<br/>(new: sign-up/confirm/resend schemas)"]:::touched
    ContractsErrors["packages/contracts/src/api/errors.ts<br/>(new: error taxonomy)"]:::touched

    ApiService["apps/api/src/auth/auth.service.ts<br/>(new)"]:::touched
    ApiController["apps/api/src/auth/auth.controller.ts<br/>(new)"]:::touched
    LocalAdapter["apps/api/src/auth/adapters/local.ts<br/>(new: real, tested)"]:::touched
    CognitoAdapter["apps/api/src/auth/adapters/cognito.ts<br/>(new: stub only)"]:::touched

    MobileSeam["apps/mobile/src/services/auth/*<br/>(new: types + local/cognito adapters)"]:::touched
    SignUpScreen["apps/mobile/app/sign-up.tsx<br/>(new)"]:::touched
    VerifyScreen["apps/mobile/app/verify-email.tsx<br/>(new)"]:::touched
    ConsentScreen["apps/mobile/app/(auth)/parental-consent.tsx<br/>(new)"]:::touched
    PostAuth["apps/mobile/src/lib/postAuthRoute.ts<br/>(new)"]:::touched

    DesignSystem["design-system/tokens.css<br/>(relocated from worktree root, content unchanged,<br/>still mismatched placeholder palette)"]:::touched

    ContractsAuth --> ApiController
    ContractsErrors --> ApiController
    AccountClass -->|"server-side gate, AC2/AC3/AC4"| ApiService
    ApiController --> ApiService
    ApiService -->|"selected by config, never both"| LocalAdapter
    ApiService -.->|"stub seam, not implemented"| CognitoAdapter

    ContractsAuth -->|"typed client"| MobileSeam
    MobileSeam --> SignUpScreen
    MobileSeam --> VerifyScreen
    SignUpScreen -->|"verification_required"| VerifyScreen
    SignUpScreen -->|"parental_consent_required"| ConsentScreen
    VerifyScreen -->|"AC5 success"| PostAuth

    SignUpScreen -.->|"brand colors read from the .html prototype, not this token set"| DesignSystem
  ```
