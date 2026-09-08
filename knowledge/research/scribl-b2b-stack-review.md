---
type: research
title: "Research note: Scribl B2B stack review"
description: What the existing Scribl B2B product is actually built on, what its tests and CI cover, the board questions its code answers, how its drawing canvas persists a drawing, and what the D2C app should reuse.
tags: [scribl, b2b, stack-review, canvas, aws, testing]
date-ingested: 2026-08-25
---

<!-- source: the scribl-b2b application source repo at commit e7876a1 (577 files), read only; and the scribl-app D2C POC repo, read only -->
<!-- date-ingested: 2026-08-25 -->

# Research note: Scribl B2B stack review

Engagement knowledge, not client-facing. Read from the B2B source at commit
`e7876a1` and from the D2C POC on the same day. Nothing was built, installed, or
run: every claim below comes from reading a file, and every claim a reader might
challenge carries a path and a line. Paths are repo-relative, prefixed with the
repo they live in.

One framing note before the detail. The B2B product is a facilitated group game,
not a consumer journal. It has hosts, players, sessions, gamepacks, prompts,
player cards, and a paid trial check. Our D2C app is a personal daily-prompt
loop. When their design looks thinner than ours, that is usually the product
speaking, not the engineering.

## 1. The stack, as built

Three packages, three separate `package.json` files, pnpm, TypeScript
everywhere. No monorepo tool: each package installs and builds on its own.

| Package | What it is | Key versions |
|---|---|---|
| `api/` | Fastify HTTP server hosting an Apollo GraphQL endpoint, plus a `graphql-ws` websocket for subscriptions | Fastify 5.2.0, Apollo Server 4.11.2, GraphQL 16.10.0, Sequelize `@sequelize/core` 7.0.0-alpha.43, `pg` 8.13.1, redis 4.7.0, `aws-jwt-verify` 4.0.1 (`scribl-b2b api/package.json:31-58`) |
| `client/` | Browser SPA, built by Vite to a static bundle | React 19.0.0, react-dom 19.0.0, react-router-dom 7.0.2, Vite 6.0.4, Apollo Client 3.12.4, aws-amplify 6.10.3, MUI 6.2.1, konva 9.3.16, react-konva 19.0.1 (`scribl-b2b client/package.json`) |
| `infrastructure/` | AWS CDK v2 app in TypeScript | aws-cdk-lib 2.173.2, cdk CLI 2.173.2, `@aws-cdk/aws-cognito-identitypool-alpha` 2.173.2-alpha.0 (`scribl-b2b infrastructure/package.json`) |

Runtimes. The api declares `engines.node >=20.0`
(`scribl-b2b api/package.json:16-18`) and its container is `node:22-slim`
(`scribl-b2b api/Dockerfile:2`). There is no `.nvmrc` and no Dockerfile for the
client or the infrastructure package: the api is the only containerized piece.

Shape of `api/`. `src/server.ts` is the real bootstrap. It builds one Fastify
instance (`:90`), mounts Apollo at `/graphql` through
`@as-integrations/fastify` (`:191-201`, `:230-244`), and stands up a separate
`WebSocketServer` with `graphql-ws` on the same path for subscriptions
(`:266-290`). `src/index.ts:1-3` only calls `startServer()`. GraphQL is the
primary surface: 13 schema files under `src/graphql/schemas/`, 12 resolvers
under `src/graphql/resolvers/`, merged in `src/graphql/index.ts:1-19` with a
custom auth directive in `src/graphql/directives.ts`. Ten REST-style files sit
in `src/controllers/`, but they are called by the resolvers rather than mounted
as their own routes.

Shape of `client/`. A browser SPA and nothing else. `src/index.tsx:39-52`
configures Amplify, `src/router.tsx:39` uses `createBrowserRouter`, and the
whole router is wrapped in a `MobileDeviceGate` (`src/router.tsx:41-42`), which
is a responsive gate, not a native shell. No React Native and no Expo
dependency exists anywhere in the manifest. Vite emits the default `dist/`,
which the deploy workflow syncs to S3 (`scribl-b2b .github/workflows/deploy.yml:129`).

Shape of `infrastructure/`. `bin/infrastructure.ts:5-88` declares a `cdk.Stage`
per environment, named `Scribl-${env}`. `lib/index.ts:1-13` composes nine
constructs: `Network`, `Data`, `Redis`, `Auth`, `API`, `Client`, `Resources`,
`AsyncTasks`, `Metrics`.

AWS services actually provisioned, each with the construct that creates it:

| Service | Where |
|---|---|
| VPC | `ec2.Vpc`, `infrastructure/lib/constructs/network.ts:52` |
| RDS Postgres | `rds.DatabaseInstance`, `.../data.ts:70`, with `DatabaseSecret` `:52` and `SubnetGroup` `:62` |
| Bastion host and a Metabase EC2 instance | `.../data.ts:108` and `:154` |
| AWS Backup vault and plan | `.../data.ts:216-227` |
| ElastiCache Redis | `elasticache.CfnReplicationGroup`, `.../redis.ts:53` |
| Cognito user pool, app client, identity pool, three groups | `.../auth.ts:120`, `:158`, ~`:168-178`, `:186-198` |
| ECS Fargate service behind an ALB | `ecs.Cluster` `.../api.ts:121`, `ecs_patterns.ApplicationLoadBalancedFargateService` `.../api.ts:126` |
| Lambda | `nodejs.NodejsFunction` at `.../auth.ts:86` and `:104` (Cognito triggers), `.../asyncTasks.ts:60` (worker), one in `.../metrics.ts` |
| SQS main queue and DLQ | `.../asyncTasks.ts:40` and `:45` |
| EventBridge rules | `.../asyncTasks.ts:115`, `.../metrics.ts:46` |
| S3 plus CloudFront, twice (client bundle, assets) | `.../client.ts:19,26` and `.../resource.ts:21,28` |
| Route 53 A records | `.../client.ts:48,53`, `.../resource.ts:40` |
| SSM parameter | `.../api.ts:203` |

No DynamoDB, no Bedrock, no AppSync is instantiated. `.../api.ts:36` declares an
`appsyncApi` field that no constructor call assigns, which reads as dead code.
ACM certificates are imported by ARN through stack props
(`infrastructure/bin/infrastructure.ts:21-22`), not created here.

Auth. Cognito, confirmed. The pool is `${environmentName}-Auth-UserPool` with
email-alias sign-in, self-signup, and custom attributes `tenant_id`,
`migrated_from_v1`, `migrated_reset_sent`, `visited_guide`, `organization`
(`infrastructure/lib/constructs/auth.ts:120-137`). The app client enables
`userPassword` and `userSrp` flows (`:158-165`). The identity pool allows
unauthenticated identities (~`:168-178`). On the api side,
`api/src/auth.ts:4-8` builds a `CognitoJwtVerifier` over access tokens and
`:10-24` verifies, wired into both the HTTP and the websocket context
(`api/src/server.ts:236-241`, `:279-287`). The root
`scribl-b2b validate-cognito-env.sh` is a shell script, not an environment file:
it reads the client's production Cognito variable names (~`:23-34`) and then
confirms the pool, app client, identity pool, bucket, and distribution exist
through the AWS CLI (~`:47-99`).

Two things in that auth path deserve to be said out loud. `api/src/auth.ts:10-24`
returns `null` on any verification failure with no logging, so a
misconfigured pool and a forged token look identical in the logs. And
`api/src/server.ts:30-41` holds a literal-token bypass, gated on an environment
flag, that grants an admin role on a hardcoded tenant, with a second
shared-secret bypass at `:48-61`. Both sit in the same code path as real auth.
Neither is our code to fix, and both are worth naming if we are ever asked to
review their security posture.

Datastore. RDS Postgres (`infrastructure/lib/constructs/data.ts:70`) reached
through Sequelize v7-alpha, with the connection assembled from `POSTGRES_*`
variables in `api/src/database/index.ts:19-72` and 12 models under
`api/src/database/models/`. Redis is a second store, used for hot session state
and pubsub (`api/src/database/redis.ts`, `infrastructure/lib/constructs/redis.ts:45,53`).
There is no versioned migration chain: `api/scripts/migrate.ts:11` calls
`sequelize.sync()` and then runs a long block of hand-written `ALTER TABLE`,
`CREATE INDEX`, and backfill SQL (`:45-232`), and the Dockerfile runs
`pnpm db:migrate` on every container start before `pnpm start` (~`:50-59`).
Schema changes therefore apply automatically on every deploy with no gate. That
is the single riskiest thing in the stack, and it is a direct argument for
E01-F3 authoring real migrations rather than copying this pattern.

Deploy. `.github/workflows/deploy.yml` is GitHub Actions, `workflow_dispatch`
only, with no push trigger (`:3-13`) and a single required environment choice of
`QA` or `Stg` (`:6-12`). It uses OIDC (`permissions: id-token: write`, `:15`),
assumes `AWS_QA_ROLE_ARN` or `AWS_STG_ROLE_ARN` through
`aws-actions/configure-aws-credentials@v4` (`:37-49`), sets up pnpm 9 and Node
22 (`:51-60`), and runs `pnpm cdk deploy --require-approval never "$CDK_STACK"`
(`:64-65`). The frontend job (`:77-143`, `needs: deploy-backend`) runs
`pnpm build --mode $BUILD_MODE`, `aws s3 sync dist/ --delete` (`:129`), and a
CloudFront invalidation of `/*` (`:131-132`). No lint, test, typecheck, or build
gate precedes the deploy.

## 2. Testing and quality, honestly

Counts, computed rather than judged:

| Area | Source files | Test files | What is covered |
|---|---|---|---|
| `api/src` | 70 | 9 | Integration-style controller and resolver pairs under `api/src/tests/integration/`, for game, gamepack, playercard, user, session, player, organization |
| `client/src` | 235 | 0 | Nothing. One Playwright spec exists outside `src`, at `client/e2e/game.spec.ts`, plus `auth.setup.ts` and three helper files |
| `infrastructure/lib` and `bin` | 23 | 1 | Nothing. `infrastructure/test/infrastructure.test.ts:1-14` is a stub whose body is empty and whose assertions are commented out |

What is untested in the api, named: `gamepack-organizations`,
`gamepack-prompts`, and `artwork-reaction` have neither a controller nor a
resolver test, and `metrics.resolver.ts` and `async-task.resolver.ts` have none
either. The nine tests only exercise controllers and resolvers, so the services,
utils, auth, and database layers, roughly 61 files, have no direct coverage.

Frameworks. Jest with ts-jest in `api/` (`api/package.json:11`,
`api/jest.config.js:1-11`) and in `infrastructure/`
(`infrastructure/package.json:7`, `infrastructure/jest.config.js:1-7`).
`client/package.json:5` sets `"test": "playwright test"`, configured at
`client/playwright.config.ts:1-49` with a single worker and a `webServer` that
boots the app on port 5173. `@testing-library/react`, `@testing-library/jest-dom`
and `@types/jest` are declared (`client/package.json:16-22`) with no runner
config to consume them, so they are leftovers from a template.

Coverage thresholds: none anywhere. No `coverageThreshold` and no
`collectCoverage` in either Jest config, and no coverage gate in any workflow.

What CI actually enforces. Three workflows.

- `.github/workflows/pr.yml:1-96` checks process hygiene only: a label is
  present (`:24`), an assignee is present (`:60`), and the title matches a
  two-project Jira prefix pattern (`:83`). No code check at all.
- `.github/workflows/linting.yml` has exactly two jobs. `lint-infrastructure`
  (`:21-61`) runs `pnpm check` in `infrastructure/`. `lint-client` (`:62-121`)
  runs `pnpm check` in `client/`. The Playwright step is commented out at
  `:88-95` behind a "TODO: implement e2e tests once project is stable", while
  the `upload-artifact` step for `client/test-results/` is still live at
  `:97-101` with nothing to upload.
- There is no api job in any workflow. The api package's lint, format, and its
  nine tests never run in CI.

So the honest read: CI enforces lint and format for two of three packages and
nothing else. No test suite runs in CI, in any package. Nothing runs a build or
a discrete typecheck. The e2e suite exists and is switched off. The api is
outside CI entirely, and the deploy workflow is not gated on any of it.

Lint and types. Flat ESLint configs in all three packages
(`api/eslint.config.mjs:1-13`, `client/eslint.config.mjs:1-40`,
`infrastructure/eslint.config.mjs:1-9`), all on `typescript-eslint` recommended
rather than strict. The client turns off `no-explicit-any` (`:29`),
`no-unsafe-assignment` (`:28`), and `explicit-function-return-type` (`:27`).
Prettier is configured per package. All three tsconfigs set `strict: true` and
then each carves out an exception: `api/tsconfig.json:11` sets
`noImplicitAny: false`, and `infrastructure/tsconfig.json:16` sets
`strictPropertyInitialization: false`.

Test management and reporting tooling: none. No JUnit reporter, no Allure,
TestRail, or Xray, no Codecov or Coveralls, and no Jest `reporters` entry. The
only test-adjacent CI step is the artifact upload noted above.

## 3. Answers to the open board questions

The Eric feedback note the brief points at is not on `main` in this repo, so the
question set below is taken from `tracking/open-questions.md` and from the five
themes the brief names. Ten questions, each answered from code with a citation
or marked unanswerable from code.

| # | Question | Answer from the B2B code |
|---|---|---|
| 1 | Which AWS environments exist, and are all three needed in phase one? (relates to Q17, E01-F1) | Four environment definitions exist in CDK, `Dev`, `Poc`, `Stg`, `Prod`, plus an ad hoc `Sandbox` (`infrastructure/bin/infrastructure.ts:5-88`). Only three have sizing config, `Dev`, `Poc`, `Prod` (`infrastructure/lib/index.ts:40-74`), so `Stg` and `Sandbox` silently inherit Dev sizing at `:81`. The pipeline ships only two: `QA`, which maps to the `Scribl-Poc` stack, and `Stg` (`.github/workflows/deploy.yml:6-12,26`). `Prod` exists in code with no deploy job. Read plainly: their own team runs a real product on two deployable environments, which is evidence that a three-environment ask in phase one is a choice, not a necessity |
| 2 | What test management or reporting tooling is wired up? (Q53) | None. No reporter, no JUnit XML, no TestRail, Xray, Allure, or coverage upload anywhere in the tree. The only artifact step, `.github/workflows/linting.yml:97-101`, uploads a directory that is never populated because the test step above it is commented out |
| 3 | Does Scribl have an existing test automation framework we can adopt? (Q58) | Effectively no, and the code confirms the client's own answer. Jest exists in two packages and Playwright in one, but the infrastructure suite is an empty stub (`infrastructure/test/infrastructure.test.ts:1-14`), the client has zero unit tests against 235 source files, and the e2e suite is disabled in CI (`.github/workflows/linting.yml:88-95`). There is one Playwright spec, `client/e2e/game.spec.ts`, worth reading as a pattern and not as a harness |
| 4 | Does crash or error reporting exist, and which provider? Crashlytics, Sentry, or Firebase? | None of those three. The provider is Rollbar, and only on the client: `client/package.json:12` `@rollbar/react ^1.0.0`, wired as a provider and error boundary at `client/src/index.tsx:13,75-78,105-108`, enabled only when a client token is set (`client/src/config.ts:24-27`). The api has no crash-reporting SDK at all, only pino logging (`api/src/log.ts:1-24`). No CDK construct creates a `LogGroup`, `Alarm`, or `Dashboard`. The `Metrics` construct (`infrastructure/lib/constructs/metrics.ts:16-49`) is a scheduled Lambda collecting in-product game stats, not observability. So: browser crashes are captured, server and infrastructure failures page nobody. That is the gap E01-F8 and E07-F5 should be sized against |
| 5 | Where is the code hosted, and what does CI assume about that? (relates to Q34, Q54) | The git remote is Bitbucket, `hs2studio/scribl-b2b`. There is no `bitbucket-pipelines.yml` anywhere. All CI is GitHub Actions under `.github/workflows/`, and `deploy.yml` depends on GitHub OIDC and GitHub secrets (`:15,37-49`). Either the repo is mirrored to GitHub or those workflows do not run at all, and the repo alone cannot tell us which. Worth asking the client directly, because it decides whether their deploy path actually exists today |
| 6 | Is a webapp already supported? | Yes, outright, and it is the only client they have. `client/` is a React 19 and Vite browser SPA with no React Native or Expo dependency, served from S3 behind CloudFront (`infrastructure/lib/constructs/client.ts:18-44`, with a 403-to-200 SPA fallback), and the deploy job already syncs the bundle and invalidates the distribution (`.github/workflows/deploy.yml:129,131-132`). Web support is shipped infrastructure, not a build item. The only mobile accommodation is a responsive gate at `client/src/router.tsx:41-42` |
| 7 | What AWS infrastructure does Scribl already hold, and who built the existing backend? (Q57) | Partly answered. The infrastructure this product holds is fully enumerated in section 1 above, from CDK source. Who built it is not in the code: there is no LICENSE, CODEOWNERS, or attribution file, and the whole history is one import commit, `e7876a1`. Unanswerable from code beyond the inventory |
| 8 | Do we reuse the existing backend and mirror the web product on mobile? (Q60) | The code supports the greenfield decision already taken. Their domain model is a facilitated group game, hosts, sessions, gamepacks, player cards, and a paid trial check, not a personal daily loop. Their auth carries `tenant_id` and `organization` custom attributes (`infrastructure/lib/constructs/auth.ts:129-137`), which is a B2B multi-tenant shape our D2C model does not have. Reusing it would mean inheriting a tenancy model we do not want |
| 9 | Can generated art be edited after the fact? | Not in their product. `client/src/components/Controls/Canvas.tsx:112,139` hard-returns in viewer mode, and the review screen mounts exactly that way (`client/src/components/Player/PlayerEndGame/DrawingCards.tsx:168`). Submission is one-shot: a client guard at `client/src/components/Player/PlayerCanvas.tsx:19-20` and a server-side idempotency return at `api/src/controllers/session.controller.ts:544-547`. An update mutation exists, `playerCardUpdateDrawing` (`api/src/controllers/playercard.controller.ts:206-218`), with no client caller. But note section 4: because they persist strokes, later editing is a client feature away for them, and a schema migration away for us |
| 10 | What user base, concurrency, and regions should the backend be sized for? (Q50) | Unanswerable from code. The RDS instance class and the Redis node type are the only sizing signals, and they live in the `environmentConfigs` block at `infrastructure/lib/index.ts:40-74`; real usage numbers are not in the repo. Nothing here tells us their production load |

Two further register questions this repo cannot answer, recorded so nobody
re-reads the code hoping: who pays for hosting (Q49) is a commercial fact, and
stylus or Apple Pencil support (Q61) has no answer here because the canvas takes
generic pointer events through Konva and never inspects an input type.

## 4. The canvas, in detail

This is the section Eric's "mimic the drawing canvas in simplicity and feel"
request rests on, and it changes what E04-F2 is worth.

**How B2B persists a drawing, in one sentence.** As vector stroke data: a JSON
array of ordered strokes, each with its own points, color, width, and source
canvas size, written into a Postgres `TEXT` column.

**How ours persists a drawing, in one sentence.** As a flattened raster: a
single base64 PNG data URI captured from the Skia surface and stored in a
Postgres `text` column.

### Their canvas, point by point

Renderer. A react-konva `Stage` and `Layer`
(`client/src/components/Controls/Canvas.tsx:199`), konva 9.3.16 and react-konva
19.0.1 (`client/package.json:31,40`). Strokes are painted by a hand-written
`sceneFunc`, `DrawPlayerImage` (`client/src/utils/drawing.tsx:72-108`), with
quadratic-curve smoothing at `:86-92` and coordinate rescaling through
`scalePoint` at `:21`. The canvas is 517px wide at most, aspect 7/10
(`Canvas.tsx:30,33`).

Persistence, the central finding. The stroke record type is
`{ points, stroke, width, tool, canvasWidth, canvasHeight }`
(`Canvas.tsx:20-27`), appended on drag (`:121-131`, `:156-160`). The submit
handler serializes the whole array: `submitDrawing(JSON.stringify(drawing))`
(`client/src/components/Player/PlayerCanvas.tsx:24`). It travels as a GraphQL
`String` (`api/src/graphql/schemas/session.schema.ts:104`), lands hot in Redis
(`api/src/controllers/session.controller.ts:552-566`) and durably in Postgres
through `PlayerCard.bulkCreate` (`api/src/services/session.service.ts:193-199,216`),
in `player_cards.drawing`, typed `DataTypes.TEXT`
(`api/src/database/models/playercard.model.ts:38-39`). Read-back parses it
straight back into strokes
(`client/src/components/Player/PlayerEndGame/DrawingCards.tsx:252`). No S3
object, no blob, no PNG is in that path.

Tools. Undo is `setDrawing(drawing.slice(0, -1))` (`Canvas.tsx:173-177`), one
whole stroke at a time, with no redo. Brush size is a single hardcoded 7
(`Canvas.tsx:54`) with no setter and no UI. The tool state declares
`'pen' | 'eraser'` (`Canvas.tsx:52`) and the eraser is unreachable. There is no
fill or bucket tool.

Colors. Six literals (`Canvas.tsx:36-43`): `#f58c29`, `#db0632`, `#d51668`,
`#99d9d9`, `#20145f`, `#18864a`. Against our palette there are zero exact
matches; the closest pairs are their `#d51668` against our `#E84393` and their
`#db0632` against our `#E23B3B`. Their six is also the number behind our
"six-ink reduced tool set" in E04-F1, which is worth knowing when Q1 and Q2 are
answered: their canvas is one width and six inks, which is the "simplicity"
Eric is pointing at.

Branded share output. Client-side, in a hidden Konva stage. `CanvasShare.tsx:45`
marks the wrapper hidden, `:30-32` sets an off-screen 829x1473 stage, `:60-66`
lays down the branded background image, `:68-78` draws the prompt text, and
`:79-85` re-renders the same vector strokes on top. The background asset is
`client/src/assets/images/frame/share.svg`. The raster only appears at export
time, `canvas.current.toBlob(...)` into `navigator.share` on mobile or a
download link on desktop
(`client/src/components/Player/PlayerEndGame/DrawingCards.tsx:269,288,293-296`).
There is no server-side image pipeline in `api/` at all: no sharp, no node
canvas, no headless renderer.

Ordering and timing. Ordering is retained twice over, strokes in array order and
points in capture order. Timestamps are not retained at all, so a replay is
possible at a synthetic constant speed but not at true drawing tempo. They
clearly intended replay: `player_cards` carries a second column `drawingLines`
commented "for replay functionality"
(`api/src/database/models/playercard.model.ts:41-43`), written only by the
`playerCardUpdateDrawing` mutation that no client calls.

### Ours, the same points

Renderer: React Native Skia, GPU-backed, `useCanvasRef()` at
`scribl-app components/canvas/SkiaCanvas.tsx:225`, ops rendered at `:384-411`.

Persistence: `makeImageSnapshot()` at `SkiaCanvas.tsx:354-356`, encoded to a
`data:image/png;base64,...` string at
`scribl-app components/canvas/DrawPad.tsx:150-153`, stashed as `imageRef` at
`scribl-app app/draw.tsx:42-49`, submitted at
`scribl-app app/choose-channels.tsx:64-70`, and written to `responses.image_ref`,
typed `text` (`scribl-app backend/db/schema.sql:76`,
`backend/lambda/data/postgres-client.ts:202-210`). The structured
`committedOps` state (`SkiaCanvas.tsx:205`, shape at `:124-142`) is discarded at
Done.

Tools: undo pops the last op (`SkiaCanvas.tsx:350-352`, `DrawPad.tsx:140-144`),
also with no redo. Six brush widths, `[2, 3, 5, 8, 12, 18]` (`DrawPad.tsx:13`),
four brush styles (`scribl-app packages/shared-types/tools.ts:13`), and a real
flood fill: snapshot, `readPixels`, scanline fill, pushed as a full-canvas
`FillOp` (`SkiaCanvas.tsx:266-306`).

Colors: sixteen, not eight. `packages/shared-types/tools.ts:18-38` lists
`#000000`, `#E23B3B`, `#FF8A3D`, `#F5C518`, `#2FA84F`, `#2F6BE2`, `#7A4A28`,
`#D9CBB8`, then `#8E44AD`, `#E84393`, `#00B5AD`, `#8BC34A`, `#34B3F1`,
`#3F51B5`, `#7F8C8D`, `#CBD5E1`. The eight-color framing in the brief is stale.
Note also a default stroke fallback of `#1A1A1A` (`SkiaCanvas.tsx:198`) that is
not in the palette, which is a small bug worth a line in E04-F1.

Branded share output: server-side, and the background is generated rather than
prebuilt. `scribl-app backend/lambda/enhance/service.ts:103-148` composites with
sharp: background resized `cover`, drawing resized `inside` to about 80 percent,
optional drop shadow, then `.png().toBuffer()`. The background itself comes from
a Claude vision description feeding an image model (`:180-199`), and the result
lands in `enhanced_image_ref` (`backend/lambda/data/postgres-client.ts:458`).
We have no fixed branded background asset. The share chrome at
`scribl-app app/share.tsx:129-158` is live React and is never rasterized.

Ordering and timing: not retained. A single PNG. Animated replay is impossible
from our persisted data without a schema change.

Editability: pre-submit only. Post-submit updates touch caption and background
prompt (`scribl-app backend/lambda/handlers/response-update.ts`,
`postgres-client.ts:379-394`), never the image refs.

### Which design is better

Theirs, on persistence, and it is not close. From one row of stroke JSON you can
render a phone thumbnail, a print, a T-shirt, an animated replay, or an
analytics feature like strokes-per-player, all after the fact. Their own code
proves it: the same stroke array renders at 517px in the editor
(`Canvas.tsx:213`) and at 749px onto the share background
(`CanvasShare.tsx:79`) with no quality loss, because `scalePoint`
(`utils/drawing.tsx:21`) rescales from the stored canvas dimensions. Our PNG was
captured at one device resolution and every downstream use is stuck with it,
which is exactly why our enhance pipeline resizes the drawing to "inside 80
percent" and hopes (`service.ts:124`). Storage compounds it: their payload is a
few KB of JSON, ours is a base64 PNG inlined into a Postgres `text` column,
which is the wrong home for image bytes at any real volume.

Ours is better on the drawing experience, and that should not be traded away in
the argument. They have one brush width, six inks, a dead eraser, no fill, and
no redo. We have sixteen colors, six widths, four brush styles, and a working
flood fill.

The two are separable, which is the recommendation. Our Skia canvas already
computes exactly the representation their persistence layer wants, ordered
stroke paths with color, width, and style (`SkiaCanvas.tsx:124-142`), and then
throws it away at `DrawPad.tsx:150`. Persist `committedOps` alongside the PNG
and add a per-stroke timestamp, which they do not have either, and we get their
optionality plus replay at true tempo plus our richer tools. The one real
obstacle is `FillOp` (`SkiaCanvas.tsx:139-142`), already a raster mask, which
would have to serialize as a seed point and a color rather than pixels. That is
the whole engineering cost, and it is small next to what it buys. It is also the
reason the E04-F2 cut listed in `tracking/backlog-epics.md:274` is the wrong two
days to save: raster-only cannot be applied retroactively to art already
submitted.

## 5. What to reuse, and what to leave

Nothing was copied in this review. Every item below is a path and a
recommendation for Rob to decide on.

### Reusable now

| Asset | Path in `scribl-b2b` | Where it would go in `scribl-app` | Provenance |
|---|---|---|---|
| Emotion reaction icons, 8 PNGs (belonging, celebrate, empathy, engagement, insightful, love, support, trust) | `client/src/assets/images/emotions/` | `assets/images/emotions/` | First-party. No LICENSE or attribution file exists in the repo, names are semantic, and they sit inside bespoke game art. Directly relevant to E05-F6 reactions |
| Gamepack category icons, 11 single-color SVGs | `client/public/gamepacks/` | `assets/images/gamepacks/` | First-party. Cleanly themeable line icons |
| Gamepack object icons, 15 objects in three weights | `client/src/assets/images/gamepacks/{big,small,white}/` | `assets/images/gamepacks/` | First-party. Lower value than the SVGs, being fixed-size raster |
| Share-card frame art, including the branded share background | `client/src/assets/images/frame/` (`share.svg`, `inner*.svg`, `outer*.svg`) | `assets/images/frame/` | First-party. This is the artwork behind the share composite Eric described |
| Prompt and QR-join UI chrome (`Drawing Board.svg`, `Prompt.svg`, `LargePrompt.svg`, `QR-Code-*.svg`, `gamePromptBackground.svg`) | `client/src/assets/images/` | `assets/images/` | First-party. We have no QR-join art at all today |
| The hidden-stage share compositor, as a pattern not as code | `client/src/components/Controls/CanvasShare.tsx:30-88` | conceptually into `app/share.tsx` | First-party logic. Their Konva implementation does not port to Skia; the approach, render off-screen at a fixed export size over a frame, does |
| Brand logo marks | `client/src/assets/images/logo.svg`, `rounded-logo.png`, `infrastructure/assets/imgs/logo.png` | no destination proposed | First-party but brand-sensitive. Whether D2C shares the B2B mark is a brand decision, not an engineering one. Named, not recommended |

Leave these:

- The typeface. `client/src/assets/styles/index.css:1` imports a hosted Adobe
  Fonts kit by URL. That is third-party licensed, tied to the client's Adobe
  account and domains, and not transferable. No local font file exists anywhere
  in the repo. If we want similar type we need our own license.
- Their color tokens as values. The Tailwind `@theme` block at
  `client/src/assets/styles/index.css:8-40` is the B2B brand palette. Our
  `src/theme/tokens.ts` is further along, carrying three runtime themes feeding
  both NativeWind and Skia. Borrow their numeric-step pattern for utility colors
  if we ever want one; do not import their hexes.
- `client/public/og-image.png` and `docs/imgs/banners/banner.png`, an identical
  2100x1050 pair. Unknown provenance: plausibly a designer's stock composite,
  and no metadata tool was available to check. Do not move until confirmed. Low
  value either way, being marketing art.
- `infrastructure/assets/imgs/*` deploy banners, `infrastructure/assets/*.pdf`
  host guides, and `docs/imgs/*` architecture and ERD diagrams. Useful to read,
  not product assets.

One item is unresolved rather than decided. Prompt copy is not in a static file:
prompts live in the database, provisioned by `api/scripts/seed.ts`. If we want
their editorial prompt set for E03-F1, someone has to read the literal strings
in that script or get a data extract. Worth asking for, because eight weeks of
hand-seeded prompts is exactly the work E03-F4 was cut to avoid.

### Standards worth adopting, and where ours already win

- **Adopt their CDK layout.** `infrastructure/lib/constructs/` with one named
  construct per concern, plus `bin/` staging per environment, beats our single
  `backend/cdk/scribl-stack.ts`. Not urgent at POC size; do it before the stack
  grows, which is E01-F2.
- **Adopt two tsconfig flags.** `noImplicitReturns` and
  `allowUnreachableCode: false` (`api/tsconfig.json:5-20`) are cheap and catch
  real bugs. Do not copy `noImplicitAny: false` from the same file, which
  defeats the `strict` it sits next to.
- **Reject their CI as a model.** Their PR gate checks labels, assignees, and
  title prefixes and never runs a test. Ours runs typecheck, lint, test, and a
  web export on every PR. Ours is the standard here, and the gap is worth
  remembering when E06-F6 writes a release gate: this is what a real product
  looks like without one.
- **Reject their error handling.** `api/src/middleware/trialCheck.ts:36-43`
  catches any database error and returns `false`, so an outage silently reads as
  "trial not expired". Paired with the silent `null` from
  `api/src/auth.ts:10-24`, that is a pattern to name and avoid. Our typed
  `ApiError` shapes with explicit request validation
  (`scribl-app backend/lambda/handlers/submit.ts:11,26,37-45`) are better.
- **Reject their migration story outright.** `sequelize.sync()` plus hand-rolled
  `ALTER TABLE` running automatically on container start
  (`api/scripts/migrate.ts:11,45-232`, `api/Dockerfile` ~`:50-59`) is the thing
  in this codebase most likely to cause an incident. E01-F3 should ship a
  versioned migration chain with a deploy gate.
- **A shared gap, not a win for either side.** Neither repo uses runtime schema
  validation. They rely on GraphQL codegen for compile-time types and we rely on
  a shared types package, and both trust hand-written validators at the edge.
  Worth one line in the E01-F5 API contract.

## Appendix: reuse candidates against the backlog

Triage, offered because it is cheap once the lists above exist.

| Reuse candidate or finding | Epic feature that would consume it |
|---|---|
| Persist stroke data alongside the raster, with timestamps | E04-F2 Stroke serialization and artwork capture |
| Their six inks and single brush width as the "simplicity" reference | E04-F1 Skia canvas with the six-ink reduced tool set |
| Share frame art and the hidden-stage compositor pattern | E15-F4 Artifacts and keepsake composition, and the share step in E05-F3 |
| Emotion reaction icon set | E05-F6 Reactions, post-unlock only |
| Gamepack category and object icons | E03-F2 Today's prompt screen |
| QR-join and prompt UI chrome | E02-F5 Invite redemption and the invite-code fallback |
| Prompt seed extract, if the client provides it | E03-F1 Seeded prompt set and fetch contract |
| CDK construct decomposition | E01-F2 CDK stack skeleton |
| Versioned migrations instead of sync-on-boot | E01-F3 Relational data model |
| Rollbar on the client only, nothing server-side | E01-F8 Baseline observability, E07-F5 Crash reporting and build traceability |
| Two deployable environments in practice against a three-environment ask | E01-F1 AWS accounts and three environments |
| One Playwright spec as a pattern, no harness to inherit | E06-F2 Tooling recommendation, E06-F5 Automation harness build |
