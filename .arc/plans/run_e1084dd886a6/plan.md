summary: |
  This is a revision pass, not a fresh draft: direct inspection of the worktree shows
  SCRIBBLE-V2-STORY-001 is **already fully implemented and committed** (`git log` on this
  branch: `0496134`/`2291314` "feat(auth): implement email/password sign-up with COPPA
  age-gating and email verification", plus two follow-up fixes to account-class
  normalization). The plan previously on file described a *different, hypothetical* stack
  (a pnpm workspace running a NestJS `apps/api`, Jest, and Zod contract schemas) that does
  not match what is actually checked in; that was corrected in an earlier revision to
  describe the real stack (plain `node:http` + Node's built-in test runner, hand-rolled
  validators, no Zod/Nest/Jest -- forced by this sandbox having no npm registry access), and
  a later revision added the reviewer's platform-scoping instruction that this is **an iOS
  app built with Expo** (Expo Router): `apps/mobile` needed a real `app.json`, `main` entry,
  root `app/_layout.tsx`, and `app/index.tsx` to actually boot at all, scoped to iOS only.
  This revision addresses the reviewer's latest instruction: the current *scope* stays
  iOS-only, but the *layering* must make a future Android port cheap, not a rebuild. Good
  news from re-reading the existing code against
  `meta-scribble-app/docs/handbook/engineering/architecture.md`'s documented client-layering
  rules (lines 155-176): every file this story has already built is already compliant, with
  zero `Platform.OS` branches anywhere and no platform-only concept baked into any shared
  type. The only genuinely iOS-specific artifact in scope is `app.json`'s `ios` key, and per
  this exact product's own documented convention
  (`meta-scribble-app/docs/android-distribution.md:64`: "the only committed change the
  native build needs is the one-line `android.package` in app.json, mirrored on iOS by
  `ios.bundleIdentifier`"), extending to Android later is a one-line sibling key addition,
  not a restructuring. This revision makes that conformance and that extension path
  explicit in the plan rather than leaving it implicit. Everything else holds unchanged:
  three packages (`packages/contracts`, `apps/api`, `apps/mobile`), `node:test` everywhere,
  `design-system/` already relocated to `scribl-mobile-app/design-system/`, and all 18
  acceptance criteria already covered by real, passing tests.

scope:
  - description: |
      Workspace skeleton at `scribl-mobile-app/` (sibling to `meta-scribble-app/`, never
      inside it): root `package.json` (single aggregate `test` script), `pnpm-workspace.yaml`
      listing `packages/*` and `apps/*`, and per-package `package.json`/`tsconfig.json` for
      `packages/contracts`, `apps/api`, `apps/mobile`. This is not a NestJS/Jest scaffold --
      there is no `@nestjs/*` or `jest` anywhere in any manifest. Every package's `test`
      script is `node --experimental-strip-types --test src/**/*.test.ts`, and the root
      script unions all three. This was a deliberate substitution, not an oversight: this
      sandbox has no network access to the npm registry, so any manifest depending on a
      real Nest/Jest/Zod install would fail at `pnpm install` before a single test could run.
    files:
      - scribl-mobile-app/package.json
      - scribl-mobile-app/pnpm-workspace.yaml
      - scribl-mobile-app/packages/contracts/package.json
      - scribl-mobile-app/apps/api/package.json
      - scribl-mobile-app/apps/mobile/package.json
    rationale: |
      Confirmed present and correct by direct read. Every other scope item needs this
      skeleton to exist first; it does, so this item is now a verification record, not a
      to-do. Platform-neutral: nothing here is mobile-OS-specific at all, so it needs no
      Android consideration.

  - description: |
      `design-system/` relocated to `scribl-mobile-app/design-system/` (tokens.json,
      tokens.css, style-guide.html, prototype-utils.css, `.contrast_check.py`), content
      unchanged. `style-guide.html`'s `<link href="tokens.css">` and
      `<link href="prototype-utils.css">` are relative to its own directory, so the move
      didn't break them. `tokens.css` still has the generation bug noted previously -- e.g.
      `--color-bg: [object Object];` -- confirmed present today; not fixed by this story,
      since fixing the token generator is a separate chore's scope.
    files:
      - scribl-mobile-app/design-system/tokens.json
      - scribl-mobile-app/design-system/tokens.css
      - scribl-mobile-app/design-system/style-guide.html
      - scribl-mobile-app/design-system/prototype-utils.css
      - scribl-mobile-app/design-system/.contrast_check.py
    rationale: |
      Confirmed done: a top-level `design-system/` no longer exists in the worktree; only
      `scribl-mobile-app/design-system/` does.

  - description: |
      `packages/contracts`: the COPPA age-gate (`domain/account-class.ts`), hand-rolled
      request validators + the `SignUpResult`/`SignInResult`/`ChallengeAnswerRequest` shapes
      (`api/auth.ts`, no Zod), and the error taxonomy (`api/errors.ts`), e.g.:
      ```ts
      export function validateSignUpRequest(
        body: unknown,
      ): { ok: true; value: SignUpRequest } | SignUpValidationFailure
      ```
      `errors.ts` extends the documented 11-code `ErrorCode` union with 5 new codes this
      story's ACs required and the draft didn't have: `unsupported_auth_method` (400),
      `confirm_email_locked` (429), `resend_cooldown` (429), `resend_limit_reached` (429),
      `payload_too_large` (413) -- the last is a defensive addition, not itself required by
      any of the 18 ACs.
    files:
      - scribl-mobile-app/packages/contracts/src/domain/account-class.ts
      - scribl-mobile-app/packages/contracts/src/api/auth.ts
      - scribl-mobile-app/packages/contracts/src/api/errors.ts
    rationale: |
      `classifyAccountAge` fails closed to `"unknown"` on unparseable/future dates
      (`account-class.ts:34-47`), matching ADR-0012; `canProceedToAccountCreation` only ever
      returns `true` for `"adult"`. This is the single server-side gate both `signUp` and
      every AC2/AC3/AC4 test key off of. Per the client-layering rules in
      `architecture.md:174` ("No iOS-only concept in a shared type"), every type here
      (`AccountClass`, `SignUpRequest`, `ErrorCode`, ...) names only cross-platform concepts
      -- confirmed by direct read, nothing here would need to change if Android were added.

  - description: |
      `apps/api`'s auth module: `auth.service.ts` (pure `signUp`/`confirmEmail`/
      `resendConfirmation` functions taking `AuthServiceDeps = { adapter, appEnv }`),
      `adapters/local.ts` (real in-memory `LocalAuthAdapter`), `adapters/cognito.ts`
      (`CognitoAuthAdapter`, every method throws `NotImplementedError`), `adapters/types.ts`
      (the shared `AuthAdapter` interface both implement), `constants.ts` (named,
      overridable thresholds), and `server.ts` -- a plain `node:http` router standing in for
      the Nest controller the story's original framing assumed, since NestJS cannot be
      installed in this sandbox. It reads the body with a capped buffer
      (`MAX_BODY_BYTES = 1_000_000`, rejecting with `payload_too_large` past that),
      dispatches to the service functions, and writes the shared
      `{ code, message, correlationId }` envelope via `writeError`. Unmapped paths
      (`/auth/federated/*`, `/auth/sign-up/phone`, anything else) fall through to
      `writeError(res, "not_found", ...)`.
    files:
      - scribl-mobile-app/apps/api/src/auth/auth.service.ts
      - scribl-mobile-app/apps/api/src/auth/adapters/local.ts
      - scribl-mobile-app/apps/api/src/auth/adapters/cognito.ts
      - scribl-mobile-app/apps/api/src/auth/adapters/types.ts
      - scribl-mobile-app/apps/api/src/auth/constants.ts
      - scribl-mobile-app/apps/api/src/auth/server.ts
    rationale: |
      Register 6.1's "local adapter that is genuinely useful, not a no-op" pattern is
      followed as designed: `LocalAuthAdapter` is exercised by every AC1-AC18 server-side
      test; `CognitoAuthAdapter` is a same-shaped stub, never exercised by a passing test
      that needs real AWS, consistent with E01-F1 being "Blocked". This entire layer runs on
      the server, not on-device -- it is identical regardless of which mobile OS calls it,
      so it needs zero changes to add Android later.

  - description: |
      Local-vs-Cognito conformance suite: one shared `for (const { name, make, skip } of
      adapters)` loop in `auth.conformance.spec.ts`, with the Cognito cases passed
      `{ skip: "E01-F1 (AWS accounts and three environments) is Blocked; no real Cognito
      credential exists yet." }` via Node's built-in `test(name, { skip }, fn)` option.
    files:
      - scribl-mobile-app/apps/api/src/auth/__conformance__/auth.conformance.spec.ts
    rationale: |
      E01-F5's "contract conformance" acceptance criterion, adapted to run against the two
      adapters instead of a separate `@scribl/mock-server`, since `apps/api` already has a
      real local adapter that would otherwise be duplicated for no benefit.

  - description: |
      iOS Expo app shell: `apps/mobile` currently has route files (`app/sign-up.tsx` etc.)
      but no way to actually boot as an Expo app: no `app.json`, no `main` entry, and no
      root `app/_layout.tsx` for Expo Router to register routes against. Add:
      - `apps/mobile/app.json` -- Expo config scoped to **iOS only** for this story's
        current scope: `"expo": { "name": "scribl", "slug": "scribl", "scheme": "scribl",
        "orientation": "portrait", "ios": { "bundleIdentifier": "com.hs2studio.scribl",
        "supportsTablet": false }, "plugins": ["expo-router"] }`. The scheme and bundle
        identifier reuse the values already documented for this exact product in
        `meta-scribble-app/docs/ios-distribution.md:146` and
        `docs/design/poc-realignment-plan.md:222`. **Future-Android note (this revision):**
        per `docs/android-distribution.md:62-64`, the *only* committed change a later
        Android build needs is a one-line sibling key, `"android": { "package":
        "com.hs2studio.scribl" }`, added next to the existing `"ios"` key in this same file
        -- `android/` itself is gitignored and regenerated by `expo prebuild`, never
        committed. Nothing else in this scope item's files changes to add that platform.
      - `apps/mobile/package.json`'s `"main"` field set to `"expo-router/entry"` -- this is
        Expo Router's entry convention and is identical on both platforms; not a per-OS file.
      - `apps/mobile/app/_layout.tsx` -- a root `Stack` (from `expo-router`) registering
        `sign-up`, `verify-email`, and `(auth)/parental-consent`. Expo Router resolves this
        route tree identically on iOS and Android; there is nothing platform-specific to
        split here.
      - `apps/mobile/app/index.tsx` -- redirects to `/sign-up` (`<Redirect href="/sign-up"
        />`), mirroring the real product's documented `/` → `/sign-up`-when-signed-out
        convention (`poc-realignment-plan.md:214`).
    files:
      - scribl-mobile-app/apps/mobile/app.json
      - scribl-mobile-app/apps/mobile/package.json
      - scribl-mobile-app/apps/mobile/app/_layout.tsx
      - scribl-mobile-app/apps/mobile/app/index.tsx
    rationale: |
      Without this, "an iOS app using Expo" doesn't exist yet even though the three route
      files and the `expo`/`expo-router` manifest dependencies already do. This is the one
      scope item that touches "Native modules and config" in `architecture.md`'s layering
      table (the bucket the doc marks **Replaced** per platform) -- everything else in this
      plan sits in the "Unchanged"/"Almost entirely unchanged" buckets of that same table,
      which is exactly why this is the only file a future Android port needs to touch at
      the config level.

  - description: |
      `apps/mobile`'s auth seam: `services/auth/types.ts` (the `AuthAdapter` interface,
      `AuthApiError`, `AuthenticatedSession`), `services/auth/adapters/local.ts` (a
      `fetch`-based client hitting the `apps/api` HTTP routes above), and
      `services/auth/adapters/cognito.ts` (mirrors the server-side stub). Two
      framework-agnostic controllers sit behind the two screens and hold every rule the ACs
      test: `controllers/signUpFormController.ts` (disabled-while-submitting state, loading
      flag, field-scoped vs. banner-level errors) and
      `controllers/verifyEmailFormController.ts` (the five banner states: `none`, `wrong`,
      `locked`, `resend-cooldown`, `resend-limit`, plus which controls each one disables).
      These controllers exist specifically *because* `apps/mobile`'s React Native/Expo
      dependencies (`expo`, `expo-router`, `react`, `react-native`, all still pinned `"*"`
      in `apps/mobile/package.json`) are declared but never actually resolved in this
      sandbox (no registry access) -- so there is no real iOS Simulator or renderer
      available to component-test the `.tsx` files against. Every rule the ACs care about is
      instead pushed into these plain-TS controllers and unit-tested directly with
      `node:test`, with the `.tsx` files reduced to thin, explicitly-unrenderable views (each
      has a header comment saying so) bound 1:1 to controller state.
    files:
      - scribl-mobile-app/apps/mobile/src/services/auth/types.ts
      - scribl-mobile-app/apps/mobile/src/services/auth/adapters/local.ts
      - scribl-mobile-app/apps/mobile/src/services/auth/adapters/cognito.ts
      - scribl-mobile-app/apps/mobile/src/controllers/signUpFormController.ts
      - scribl-mobile-app/apps/mobile/src/controllers/verifyEmailFormController.ts
    rationale: |
      Putting `answerChallenge` on the same `AuthAdapter` interface as `confirmEmail` is what
      makes AC7 a cheap, precise spy test on the controller directly (no server, no
      renderer, no Simulator needed): `verifyEmailFormController.test.ts` asserts a spied
      `answerChallenge` is never called during `confirm()`. **Layering for future Android:**
      this is exactly `architecture.md`'s "`services/` interfaces: Unchanged -- the
      interface is the contract, only the adapter behind it varies" plus "`data/`,
      `stores/`, ... : Unchanged" rows. `LocalAuthAdapter` here is a plain `fetch()` call,
      and `fetch` behaves identically on iOS and Android in Expo/React Native, so this
      specific adapter needs no `.ios.ts`/`.android.ts` split either -- confirmed by direct
      read, there is no `Platform.OS` reference anywhere in `services/auth/` or
      `controllers/` today. A real platform split would only ever be needed for an adapter
      whose *native* behavior genuinely differs (e.g. secure token storage, push
      registration) -- none of which this story's scope requires.

  - description: |
      Sign-up screen (`apps/mobile/app/sign-up.tsx`), built from design Screens 1 (default),
      2 (submitting), and 7 (validation errors): email → password → display name → date of
      birth fields in that order, a full-width "Create account" primary button (label
      switches to "Creating account…" with an `ActivityIndicator` while
      `state.showLoadingIndicator` is true), a bottom "already have an account? Sign in
      instead" link, a top-of-card banner slot for any error the three field-scoped slots
      don't own, and inline `FieldError` rendering under `email`/`password`/`dateOfBirth`
      specifically. Bound entirely to `signUpFormController`; the screen itself holds no
      validation or disablement logic. Registered as the `sign-up` route by the new root
      `_layout.tsx` above.
    files:
      - scribl-mobile-app/apps/mobile/app/sign-up.tsx
    rationale: |
      Matches the design's card layout (eyebrow / `h1` "Join Scribl" / subtitle / four
      fields / button / divider / sign-in link) read directly from
      `.arc/designs/SCRIBBLE-V2-STORY-001-design.html` lines 446-540 and 693-752. Uses only
      cross-platform RN primitives (`View`, `Text`, `TextInput`, `Pressable`,
      `ActivityIndicator`) with zero `Platform.OS` branches -- confirmed by direct read --
      matching `architecture.md`'s "`features/*` ... : Almost entirely unchanged. React
      Native renders both; divergence here should be a layout decision, not a logic one."
      Not component-tested (no iOS Simulator available in this sandbox); its logic is fully
      covered via `signUpFormController.test.ts`.

  - description: |
      Verify-email screen (`apps/mobile/app/verify-email.tsx`), built from design Screens 3
      (default + tabbed states), 4 (confirming/loading), and 5 (authenticated), lines
      542-651: an avatar circle showing the display name/email's first initial, a 6-digit
      numeric code input (`maxLength={6}`), a "Confirm and continue" button (swaps to
      "Confirming…" with a spinner while `state.submitting`), a "Didn't get it? Resend code"
      row, and a `BANNER_COPY` table rendering the five banner-state variants
      (`none`/`wrong`/`locked`/`resend-cooldown`/`resend-limit`) with the exact
      disabled-control combination each one implies (lockout disables both the code input
      and submit; the two resend states disable only the resend control).
    files:
      - scribl-mobile-app/apps/mobile/app/verify-email.tsx
    rationale: |
      AC5, AC6, AC7, AC13, AC16, AC17, AC18 all live on this screen's state machine, which is
      `verifyEmailFormController`, not the `.tsx` view -- so all seven are covered by
      `verifyEmailFormController.test.ts` without needing a renderer or Simulator. Same
      cross-platform-primitives-only pattern as the sign-up screen above.

  - description: |
      Parental-consent screen (`apps/mobile/app/(auth)/parental-consent.tsx`), matching
      design Screen 6 (lines 651-693): "Let's bring in a parent or guardian" heading, a
      "No account has been created yet" warning banner, and a kv-list of email submitted /
      consent request id / status "Not started". Reached from the sign-up screen's
      `parental_consent_required` branch; renders only `email`/`consentRequestId` passed as
      route params, no local logic to unit-test.
    files:
      - scribl-mobile-app/apps/mobile/app/(auth)/parental-consent.tsx
    rationale: |
      AC2/AC3's "no account created" guarantee is enforced server-side
      (`auth.service.ts`/`local.ts`, covered by `auth.service.test.ts`); this screen is purely
      the display of that already-proven outcome, per ADR-0012 "Option A".

  - description: |
      Post-verification landing: `postAuthRoute()` (currently a one-line stub returning
      `"/today"`) wired into `verify-email.tsx`'s `state.authenticated` effect
      (`router.replace(postAuthRoute())`), standing in for design Screen 5's "Go to today's
      prompt" CTA without building the daily-prompt screen itself (RE-03, separate epic).
    files:
      - scribl-mobile-app/apps/mobile/src/lib/postAuthRoute.ts
      - scribl-mobile-app/apps/mobile/app/verify-email.tsx
    rationale: |
      AC5 only requires arriving at an authenticated session, not a built daily-prompt home
      screen; `postAuthRoute.test.ts` asserts the decision function's return value in
      isolation. `postAuthRoute()` is a plain string-returning function with no platform
      awareness -- another "Unchanged" node under `architecture.md`'s layering table.

tests:
  - |
    **AC1** (adult → `verification_required`) -- three layers, all already passing:
    `packages/contracts/src/domain/account-class.test.ts`:
    `assert.equal(classifyAccountAge("1990-04-12", NOW), "adult");`
    `apps/api/src/auth/auth.service.test.ts`:
    `assert.deepEqual(result.value, { kind: "verification_required", email: "matthew@example.com" });`
    `apps/api/src/auth/auth.http.test.ts`:
    `assert.deepEqual(json, { kind: "verification_required", email: adultBody.email });` (status 200).
  - |
    **AC2** (minor → `parental_consent_required`) --
    `account-class.test.ts`: `assert.equal(classifyAccountAge("2016-01-01", NOW), "minor");`
    `auth.service.test.ts`:
    `assert.equal(result.value.kind, "parental_consent_required"); assert.equal(result.value.accountClass, "minor"); assert.equal(typeof result.value.consentRequestId, "string");`
  - |
    **AC3** (prod minor → no account created) -- `auth.service.test.ts`, spying on
    `adapter.createUser`:
    ```ts
    await signUp(minorBody, { adapter, appEnv: "prod" });
    assert.equal(createUserCalls.length, 0);
    assert.equal(await adapter.findUserByEmail(minorBody.email), null);
    ```
  - |
    **AC4** (unparseable/future dateOfBirth → field-scoped validation error, never a
    discriminated kind) -- `auth.http.test.ts`, looping `["not-a-date", "2099-01-01"]`:
    `assert.equal(status, 422); assert.equal(json.code, "validation_failed"); assert.match(json.message, /date of birth/i);`
  - |
    **AC5** (correct code → authenticated session) --
    `auth.http.test.ts`: `assert.equal(status, 200); assert.equal(typeof json.sessionId, "string"); assert.ok(adapter.hasSessionForTesting(json.sessionId));`
    Mobile: `verifyEmailFormController.test.ts`:
    `assert.equal(state.authenticated, true); assert.deepEqual(state.session, { sessionId: "session-1", accessToken: "token-1" });`
  - |
    **AC6** (incorrect code → no session) -- `auth.http.test.ts`:
    `assert.notEqual(status, 200); assert.equal(json.sessionId, undefined);`
    Mobile: `assert.equal(controller.getState().authenticated, false); assert.equal(controller.getState().bannerState, "wrong");`
  - |
    **AC7** (confirm-email never invokes the sign-in-time challenge path) --
    `auth.service.test.ts`, spying on `adapter.answerChallenge`:
    `assert.equal(result.ok, true); assert.equal(challengeCalls, 0);`
    Mobile: `verifyEmailFormController.test.ts`: `assert.equal(challengeCalls, 0);`
  - |
    **AC8** (sign-up response never carries a token) --
    `auth.service.test.ts`: `assert.doesNotMatch(serialized, /accessToken/); assert.doesNotMatch(serialized, /refreshToken/);`
    `auth.http.test.ts`: `assert.ok(!("accessToken" in json)); assert.ok(!("refreshToken" in json));`
  - |
    **AC9** (social/phone endpoints not exposed; 404) -- `auth.http.test.ts`:
    ```ts
    const res1 = await fetch(`${baseUrl}/auth/federated/google`, { method: "POST" });
    assert.equal(res1.status, 404);
    assert.equal((await res1.json()).code, "not_found");
    ```
    (repeated for `/auth/sign-up/phone`).
  - |
    **AC10** (federated-token/phone payload rejected as unsupported) -- `auth.http.test.ts`:
    `assert.equal(status, 400); assert.equal(json.code, "unsupported_auth_method");` for both
    `{ ...adultBody, providerToken: "abc" }` on `/auth/sign-up` and
    `{ phoneNumber: "+1..." }` on `/auth/sign-in`.
  - |
    **AC11** (already-registered email → conflict, points to sign-in) --
    `auth.service.test.ts`: `assert.equal(second.code, "conflict"); assert.match(second.message, /already registered/i); assert.match(second.message, /sign in/i);`
    `auth.http.test.ts`: `assert.equal(status, 409);` with the same message assertions.
  - |
    **AC12** (password-policy violation → field-scoped error) -- `auth.http.test.ts`:
    `assert.equal(status, 422); assert.match(json.message, /password/i);` for `password: "hunter2"`.
  - |
    **AC13** (confirm-email lockout after max failed attempts) -- `auth.http.test.ts`, using
    a fake clock and `CONFIRM_EMAIL_MAX_ATTEMPTS`:
    `assert.equal(status, 429); assert.equal(json.code, "confirm_email_locked");`
    Mobile: `verifyEmailFormController.test.ts`:
    `assert.equal(state.codeInputDisabled, true); assert.equal(state.submitDisabled, true);`
  - |
    **AC14** (submit control disabled while sign-up is in flight) --
    `signUpFormController.test.ts`, using a manually-resolved deferred promise:
    ```ts
    const submitPromise = controller.submit();
    assert.equal(controller.getState().submitDisabled, true);
    ```
  - |
    **AC15** (loading indicator shown while sign-up is in flight) --
    `signUpFormController.test.ts`:
    `assert.equal(controller.getState().showLoadingIndicator, true);` (same in-flight window as AC14).
  - |
    **AC16** (resend rejected before cooldown elapses) -- `auth.http.test.ts`, fake-clock
    advanced past sign-up but not past `RESEND_COOLDOWN_MS` between the two resend calls:
    `assert.equal(status, 429); assert.equal(json.code, "resend_cooldown");`
    Mobile: `assert.equal(state.bannerState, "resend-cooldown"); assert.equal(state.resendDisabled, true);`
  - |
    **AC17** (resend rejected at the per-window limit) -- `auth.http.test.ts`, looping
    `RESEND_LIMIT_PER_WINDOW` successful resends (advancing the clock past cooldown each
    time) then one more:
    `assert.equal(status, 429); assert.equal(json.code, "resend_limit_reached");`
  - |
    **AC18** (no further code sent once the resend limit is hit) -- same
    `auth.http.test.ts` test as AC17:
    `assert.equal(adapter.getLastSentCodeForTesting(adultBody.email), codeBefore);`
    Mobile: `assert.equal(resendCalls, 1);` (the call that returned `resend_limit_reached`
    is the only one made; no second code-sending call follows it).

assumptions_or_open_questions:
  - |
    **New this turn:** the reviewer clarified that while current scope is iOS-only, the
    layering must keep a future Android port cheap. This plan does not add Android scope
    now (no `android` key in `app.json`, no Android build/test step) -- it only verifies and
    documents that the existing layering already satisfies
    `meta-scribble-app/docs/handbook/engineering/architecture.md`'s three stated rules
    (`Platform.OS` confined to `services/` adapters and styling; `.ios.ts`/`.android.ts`
    file convention for adapters that genuinely differ per platform; no platform-only
    concept in a shared type). Confirmed by direct read: zero `Platform.OS` references exist
    anywhere in `scribl-mobile-app/apps/mobile/src/` or `app/` today, so there is no
    violation to fix and no split to add yet.
  - |
    Per `docs/android-distribution.md:62-64`, the committed cost of adding Android later is
    exactly one line in `app.json` (`"android": { "package": "com.hs2studio.scribl" }`
    alongside the existing `"ios"` key) plus running `expo prebuild --platform android`
    (which regenerates a gitignored `android/` directory, same pattern as `ios/`). This plan
    treats that one-line addition, and the resulting native build/test pass, as future,
    separate-story work -- not something to pre-build speculatively now, per the instruction
    to stay within this story's iOS-only ACs.
  - |
    `services/auth/adapters/local.ts` (mobile) is a plain `fetch()`-based HTTP client. Per
    `architecture.md`'s table, `services/*` **adapters** are the layer marked "Replaced" per
    platform only when the underlying native behavior genuinely differs (secure storage,
    biometrics, push, audio, file access). `fetch` itself does not differ between iOS and
    Android in Expo/React Native, so this specific adapter is not expected to need an
    `.ios.ts`/`.android.ts` split even once Android exists -- flagging this explicitly so a
    future implementer doesn't split a file that doesn't need splitting.
  - |
    The worktree is still not empty and this feature is still already implemented and
    committed (`git log`: `0496134`/`2291314` feat commits, `7c43074`/`eb6fb2b` fix commits).
    This plan documents the as-built state plus the Expo-app-shell gap; it does not assume a
    from-scratch rebuild.
  - |
    `apps/mobile/app.json`'s bundle identifier (`com.hs2studio.scribl`) and scheme
    (`"scribl"`) are read directly from `meta-scribble-app/docs/ios-distribution.md:146` and
    `docs/design/poc-realignment-plan.md:222`, which document these values for the real,
    separate `ScriblOrg/scribl-mobile-app` build repo. Reusing them here keeps this fresh
    build consistent with that documented product identity.
  - |
    `docs/ios-distribution.md` documents a project rule this plan does not act on but flags
    for awareness: **OSS-only, no EAS** (Expo's hosted Build/Submit service) -- builds and
    CI/CD live in AWS. This story's scope is the sign-up flow's code and tests, not
    build/release tooling, so no `eas.json` is added here; a future release-readiness story
    owns that, for whichever platform(s) are in scope at that time.
  - |
    `apps/mobile/package.json` still declares `expo`, `expo-router`, `react`, `react-native`
    as dependencies pinned `"*"`, and this plan does **not** pin them to concrete version
    numbers: this sandbox has no registry access to verify what's actually
    installable/compatible right now, and guessing a specific Expo SDK / React Native
    version here risks a hallucinated, non-existent version string breaking a real install
    step later for no benefit. Recommend the implementer run the real Expo tooling (e.g.
    `npx expo install expo-router react react-native` from within `apps/mobile`) once
    registry access exists.
  - |
    None of the three screens currently wrap their content in a `SafeAreaView` -- confirmed
    by direct read, all three use a plain `View` with manual `padding`. `SafeAreaView` (or
    `react-native-safe-area-context`'s equivalent) behaves identically on iOS and Android, so
    adding it later is not an Android-readiness concern, just a still-open iOS fit-and-finish
    item from the prior revision (notch/home-indicator insets).
  - |
    The two live screens default `EXPO_PUBLIC_API_BASE_URL` to `http://localhost:3000`, but
    `docs/ios-distribution.md`'s documented local-dev convention for this product has the iOS
    Simulator reaching the backend at `localhost:8787` (and `docs/android-distribution.md`
    documents the Android-emulator equivalent as `http://10.0.2.2:8787` -- a genuine,
    unavoidable platform difference, but one that lives in an environment variable set at
    build/run time, not in committed code). Not reconciled here; whichever port `apps/api`'s
    dev server actually binds to when run should be reflected in `EXPO_PUBLIC_API_BASE_URL`
    at that time.
  - |
    Design Screen 8's simulated response uses a non-standard `{ "error": "...", "message":
    "..." }` envelope (line 788), conflicting with the standard `{ code, message,
    correlationId }` envelope used everywhere else in the contract and implemented in
    `writeError()`. The implementation resolves this by treating Screen 8's JSON as
    illustrative shorthand and using the standard envelope with `code:
    "unsupported_auth_method"` -- still flagged for architect sign-off since the mockup
    itself was never corrected.
  - |
    Design Screen 1's fixture password ("correct-horse-battery-staple", all lowercase, no
    digits) still does not satisfy the password policy Screen 7 itself states (12+ chars,
    upper, lower, number). Tests use a policy-conformant fixture (`"Str0ngPassword"`)
    instead of the mockup's literal value. Still an unresolved inconsistency in the approved
    mockup.
  - |
    `design-system/tokens.css`'s placeholder palette and `[object Object]` generation bug
    are both still present post-relocation. The two new mobile screens read their actual
    colors from `apps/mobile/src/theme.ts`, hand-transcribed from the approved prototype's
    `:root` custom properties, not from this token set. Reconciling the two palettes remains
    out of this story's scope.
  - |
    Numeric thresholds (`CONFIRM_EMAIL_MAX_ATTEMPTS = 5`, `CONFIRM_EMAIL_LOCKOUT_MS = 15min`,
    `RESEND_COOLDOWN_MS = 60s`, `RESEND_LIMIT_PER_WINDOW = 3`, `RESEND_WINDOW_MS = 1hr`) are
    implemented as named, overridable constants in `apps/api/src/auth/constants.ts`, chosen
    because no doc specifies exact values. Still pending confirmation against a real
    product/security decision.

package_dependencies: []

notes: |
  Why `package_dependencies` is still empty: every module this story's scope touches --
  `packages/contracts`, `apps/api/src/auth/*`, and `apps/mobile/src/{services,controllers,lib}`
  -- imports only `node:*` built-ins and each other; none of them import a third-party
  package. `expo`/`expo-router`/`react`/`react-native` are already declared (not newly added
  by this plan) in `apps/mobile/package.json`, just left at `"*"` rather than pinned, per the
  open question above -- pinning a guessed version here risks failing a real install step,
  which is worse than leaving it for the implementer to resolve with real registry access.

  Grounding for this revision's layering claims:
  `meta-scribble-app/docs/handbook/engineering/architecture.md` lines 155-181 (the
  cross-platform client-layering table and its three enforcement rules -- `Platform.OS`
  confined to `services/`/styling, `.ios.ts`/`.android.ts` split for genuinely-differing
  adapters, no platform-only concept in a shared type) and
  `meta-scribble-app/docs/android-distribution.md` lines 50-64 (the one-line
  `android.package` addition, `android/` gitignored and regenerated by `expo prebuild`,
  `EXPO_PUBLIC_API_BASE_URL` baked in per build with `10.0.2.2` as the Android-emulator
  loopback convention vs. iOS Simulator's plain `localhost`). Carried over unchanged from
  prior revisions: `meta-scribble-app/docs/ios-distribution.md` (bundle id
  `com.hs2studio.scribl`, OSS-only/no-EAS build rule) and `docs/design/poc-realignment-plan.md`
  (`app.json` scheme `"scribl"`, `app/_layout.tsx` root stack, `app/index.tsx` redirect) --
  both describing the real, separate `ScriblOrg/scribl-mobile-app` build repo, reused here
  only as naming/config convention since that repo isn't checked into this worktree. Also
  carried over: `meta-scribble-app/handbook/engineering/data-and-api/api-contract-draft.md`
  (v3.4 wire contract), ADR-0012 and decision-register 3.1/6.1/7.1/7.2, and design-screen
  numbering re-verified directly against
  `.arc/designs/SCRIBBLE-V2-STORY-001-design.html`.

  ```mermaid
  flowchart TD
    classDef touched fill:#f96,color:#000
    classDef future fill:#eee,color:#555,stroke-dasharray: 3 3

    AppJson["apps/mobile/app.json<br/>(new: Expo config, iOS only today)"]:::touched
    AndroidKey["future: sibling 'android' key<br/>+ expo prebuild --platform android<br/>(one-line add, separate story)"]:::future
    RootLayout["apps/mobile/app/_layout.tsx<br/>(new: Stack registering the 3 routes)"]:::touched
    RootIndex["apps/mobile/app/index.tsx<br/>(new: redirect to /sign-up)"]:::touched

    AccountClass["packages/contracts/src/domain/account-class.ts<br/>(COPPA gate, platform-neutral)"]:::touched
    ContractsAuth["packages/contracts/src/api/auth.ts<br/>(validators, no Zod)"]:::touched
    ContractsErrors["packages/contracts/src/api/errors.ts<br/>(16-code ErrorCode union)"]:::touched

    ApiService["apps/api/src/auth/auth.service.ts"]:::touched
    ApiServer["apps/api/src/auth/server.ts<br/>(plain node:http router, not Nest)"]:::touched
    LocalAdapter["apps/api/src/auth/adapters/local.ts<br/>(real, in-memory, fully tested)"]:::touched
    CognitoAdapter["apps/api/src/auth/adapters/cognito.ts<br/>(stub)"]:::touched

    MobileSeamTypes["apps/mobile/src/services/auth/types.ts<br/>(AuthAdapter interface, Unchanged for Android)"]:::touched
    MobileLocal["apps/mobile/src/services/auth/adapters/local.ts<br/>(fetch client, no Platform.OS)"]:::touched
    SignUpController["apps/mobile/src/controllers/signUpFormController.ts<br/>(Unchanged for Android)"]:::touched
    VerifyController["apps/mobile/src/controllers/verifyEmailFormController.ts<br/>(Unchanged for Android)"]:::touched
    SignUpScreen["apps/mobile/app/sign-up.tsx<br/>(RN primitives only)"]:::touched
    VerifyScreen["apps/mobile/app/verify-email.tsx"]:::touched
    ConsentScreen["apps/mobile/app/(auth)/parental-consent.tsx"]:::touched
    PostAuth["apps/mobile/src/lib/postAuthRoute.ts"]:::touched

    AppJson -.->|"future, one line, this story does NOT add it"| AndroidKey
    AppJson -.->|"Expo CLI config, iOS bundle/scheme"| RootLayout
    RootLayout -->|"registers route"| SignUpScreen
    RootLayout -->|"registers route"| VerifyScreen
    RootLayout -->|"registers route"| ConsentScreen
    RootIndex -->|"initial redirect"| SignUpScreen

    ContractsAuth -->|"validated body"| ApiServer
    ContractsErrors -->|"status + envelope"| ApiServer
    ApiServer --> ApiService
    AccountClass -->|"server-side gate, AC2/AC3/AC4"| ApiService
    ApiService -->|"selected by appEnv/config"| LocalAdapter
    ApiService -.->|"stub seam"| CognitoAdapter

    MobileSeamTypes --> MobileLocal
    MobileLocal -->|"HTTP, identical on iOS/Android"| ApiServer
    MobileSeamTypes --> SignUpController
    MobileSeamTypes --> VerifyController
    SignUpController --> SignUpScreen
    VerifyController --> VerifyScreen
    SignUpScreen -->|"verification_required"| VerifyScreen
    SignUpScreen -->|"parental_consent_required"| ConsentScreen
    VerifyScreen -->|"AC5 success"| PostAuth
  ```
