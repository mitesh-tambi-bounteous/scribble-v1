# Toolchain: package manager, tools, scripts, build variants

The tool decisions, the reasoning behind each, and the complete command surface.
Every script here is an acceptance criterion of deliverable 0 in
`SCAFFOLD_PROMPT.md`.

---

## 1. Package manager: pnpm workspaces

**Decision, updated 2026-09-02: pnpm.** This section originally decided npm; the
shipped `scribl-mobile-app` repo ships `pnpm-lock.yaml` and
`pnpm-workspace.yaml`, past the "roughly four workspace packages" revisit
trigger the original decision itself named (three apps plus five packages as
of this writing). No record of the switch's own reasoning -- whether the
React Native autolinking risk below was mitigated, tested away, or simply
accepted -- was found in this repo. See decision-register.md 9.1 for the same
entry. The original npm reasoning is kept below because it names a real risk
that a pnpm-based team should actively verify rather than assume solved.

**The risk the original decision named, still worth checking.** pnpm's two
real advantages are disk efficiency and strictness: a symlinked store
prevents phantom dependencies, meaning code cannot import a package it did
not declare. React Native's native builds resolve autolinking by walking
`node_modules`, and a symlinked tree is the fragile case historically.
Metro's symlink support has improved, and `node-linker=hoisted` in `.npmrc`
is the fallback if autolinking breaks -- but hoisted mode produces a flat
tree, which forfeits the strictness that was the reason to choose pnpm. If
the shipped repo is on hoisted mode, that trade-off is live and worth naming
explicitly rather than leaving implicit in a config file.

**Why not Yarn.** Berry's PnP resolution is actively hostile to React Native, and
classic is effectively unmaintained. Neither buys anything over pnpm here.

**Why not Bun.** Fast and genuinely interesting, but its value is largest as a
runtime, and adopting it as a runtime for the backend is a much bigger bet than a
package manager choice. Native-module and Expo-prebuild compatibility is not
as proven as pnpm's. Not worth the risk on the one repo that has to ship.

**Pinning, so every machine and the pipeline agree:**

- `.nvmrc` / `.node-version` at the repo root
- `engines.node` set to the same major
- `pnpm-lock.yaml` committed, always
- `pnpm install --frozen-lockfile` in CI, never a plain install

**Superseded decision, kept readable because the reasoning may still apply to
a future choice between these two tools:**

> **Decision: npm.** Considered pnpm, Yarn and Bun. The reasoning matters more than
> the conclusion, because the conclusion would be different on a different project.
>
> **Why not pnpm**, which is the strongest alternative. Its two real advantages are
> disk efficiency and strictness: a symlinked store prevents phantom dependencies,
> meaning code cannot import a package it did not declare. That strictness is
> genuinely valuable and it is the thing we would want.
>
> The problem is React Native. Native builds resolve autolinking by walking
> `node_modules`, and a symlinked tree is the fragile case. Metro's symlink support
> has improved a lot and pnpm is viable now with `node-linker=hoisted` in `.npmrc`
> -- but hoisted mode produces a flat tree, which **forfeits exactly the strictness
> that was the reason to choose pnpm.** The trade collapses: you take on the
> integration risk and give up the reward.
>
> The second reason is scale. pnpm's benefits grow with the number of workspace
> packages. We have **one** shared package, `contracts`. npm workspaces handles one
> shared package without complaint.
>
> The third is failure mode. A package-manager problem here does not surface as a
> clear error; it surfaces as a native build failure the evening before a demo, and
> debugging autolinking through symlinks is a miserable way to spend that evening.
> Expo and React Native are tested most heavily against npm, and on the fragile
> part of this stack we want the well-trodden path.
>
> **What "modern npm" means in practice**, since npm's reputation was set by npm 6:
> npm 10 ships with Node 22, workspaces are first class, and `npm ci` in CI with a
> cached store is fast enough that install time is not the bottleneck.
>
> **Revisit pnpm when** the monorepo passes roughly four workspace packages, or
> install time becomes a measured complaint rather than a feeling. Record the
> revisit as an ADR; do not switch quietly, because a package manager change is a
> whole-team change.

---

## 2. Tool choices

| Concern | Choice | Why this one |
|---|---|---|
| Language | TypeScript, strict, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` | The extra two flags catch the errors plain strict misses |
| Lint | **ESLint 9**, flat config, on `eslint-config-expo` | Expo's config already knows about React Native, Metro and the platform extensions. Rebuilding that knowledge is not free |
| Format | **Prettier** | Boring and universal. Considered Biome, which is much faster and does both jobs -- but its rule coverage for React Native and Expo is thinner, and `eslint-config-expo` does not transfer. Revisit when that gap closes |
| Boundaries | **dependency-cruiser** | Encodes `architecture.md` section 2 as machine-checked rules. The highest-value guardrail in the repo |
| Tests | **Jest everywhere**, two projects | The app side needs `jest-expo` for the React Native transform regardless. Vitest is nicer for the backend, but two runners means two mental models, two configs and two sets of quirks for one team. One runner, two projects |
| Web E2E | **Playwright** | Tests the web export. Fast, reliable, already proven on the POC |
| Native E2E | **Deferred** | Neither Detox nor Maestro is set up. When it is needed, Maestro first: far simpler to run and to keep green. Not in this phase |
| Git hooks | **husky** plus **lint-staged** | Standard, well understood, easy for a new joiner to reason about |
| Commit messages | **commitlint**, conventional config | Cheap to adopt, and it makes release notes generated rather than written |
| Secret scan | **gitleaks** | Single binary, fast enough for a pre-commit hook, runs the same way locally and in CI |
| Dependency audit | `npm audit` at a threshold, plus a documented exceptions file | Audit output is noisy. A threshold plus written exceptions is honest; ignoring it entirely is not |
| Licence check | `license-checker` in CI | Copyleft in a shipped mobile binary is a legal problem, not a preference |
| Container | Docker via **Colima** locally | Licensing, see `dev-setup.md` |
| IaC | **AWS CDK**, TypeScript, `npx` from `infra/` | Never a global install. Everyone runs the same version. **Under review 2026-09-02**: the shipped repo's `infra/README.md` names Terraform for this stub instead; see ADR-0005 and code-questions.md A10 |

---

## 3. Build variants and environments

Three environments. A developer, a tester and a real user must be able to have
different builds on the same device without collision.

| Environment | `APP_ENV` | Bundle id | App name | Talks to |
|---|---|---|---|---|
| Development | `dev` | `co.scribl.app.dev` | Scribl (Dev) | localhost |
| QA | `qa` | `co.scribl.app.qa` | Scribl (QA) | the QA API |
| Production | `prod` | `co.scribl.app` | Scribl | the production API |

**Production keeps the clean identifier**, `co.scribl.app`. Suffixes are for
non-production only, and they exist so a tester can hold a QA build and a
production build side by side. That is not a nicety: without it, verifying a fix
means uninstalling the app they were using.

`APP_ENV` drives a **dynamic `app.config.ts`**, not three checked-in plist files.
One config function reads `APP_ENV` and returns the identifier, display name,
icon variant, API base URL and flag adapter. Static config duplicated three ways
drifts, and the drift is silent.

**Nothing secret goes in app config.** Anything in a build is public; see
`engineering-standards.md` section 5.

---

## 4. Scripts

The complete surface. Names are chosen so that guessing works: `dev:*` runs
things, `db:*` touches the database, `build:*` produces artifacts, and the two
aggregates are `check` and `verify`. Written when the package manager was npm;
run every `npm run <script>` below as `pnpm run <script>` per section 1's
2026-09-02 update. The script names themselves are unaffected.

### Development

| Script | Does |
|---|---|
| `npm run dev` | The one command. Database up, migrate, seed, then API and web app together |
| `npm run dev:app` | Web app only, against whatever the env points at |
| `npm run dev:api` | API only, watch mode |
| `npm run dev:mock` | App against the contract mock. No database, no API. The fastest loop for UI work |
| `npm run ios` | iOS simulator, native |
| `npm run android` | Android emulator, native |

### Database

| Script | Does |
|---|---|
| `npm run db:up` | Start the container, block until healthy |
| `npm run db:down` | Stop it, keep the volume |
| `npm run db:migrate` | Apply pending migrations. Idempotent |
| `npm run db:seed` | Seed development data. Idempotent |
| `npm run db:reset` | Drop, recreate, migrate, seed. Local only, and it refuses a non-local host |
| `npm run db:seed:reviewer` | Seed the store-reviewer demo account, pre-populated so submit-to-unlock does not show a reviewer an empty wall |

### Quality, individually runnable

Each one runs alone so a developer can fix one class of problem at a time.

| Script | Does |
|---|---|
| `npm run typecheck` | `tsc --noEmit` across all workspaces |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check, no writes. This is the CI form |
| `npm run boundaries` | dependency-cruiser. **The architecture, enforced** |
| `npm run test` | Jest, both projects |
| `npm run test:watch` | Jest watch |
| `npm run test:coverage` | Jest with coverage |
| `npm run test:e2e` | Playwright against the web export |
| `npm run secrets` | gitleaks over the working tree and history |
| `npm run audit` | `npm audit` at the agreed threshold |
| `npm run licenses` | Licence check |
| `npm run flags:stale` | Report release and experiment flags past `removeBy`. Warns, never fails |

**Retired 2026-08-27.** `docs:publish` and `docs:publish:check` published this
repo's engineering documentation into `meta-scribl-app`. The engineering
documentation now lives only in `meta-scribl-app/handbook/engineering/`, so
there is no copy left to publish to or check drift against; remove these two
scripts and the `publish-docs-to-brain.mjs` script they called the next time
this repository's `package.json` is touched.

### The two aggregates

| Script | Runs | When |
|---|---|---|
| `npm run check` | typecheck, lint, format:check, boundaries | Constantly. Seconds, no tests, no network. The inner loop |
| `npm run verify` | `check`, then test, secrets, audit, licenses, build:web | Before every push. **Mirrors the pipeline exactly** |

`verify` mirroring CI is the point of it. A green `verify` and a red pipeline
means the two have drifted, and that is a bug in the pipeline definition, not bad
luck.

### Builds

| Script | Does |
|---|---|
| `npm run build:web` | `expo export -p web`. Also the CI smoke test that the bundle resolves |
| `npm run build:api` | Docker image, multi-stage, tagged with the commit sha |
| `npm run prebuild:ios` | `expo prebuild -p ios`, clean |
| `npm run prebuild:android` | `expo prebuild -p android`, clean |
| `npm run build:ios:qa` | Signed iOS build, `APP_ENV=qa`. Needs signing material |
| `npm run build:ios:prod` | Signed iOS build, `APP_ENV=prod` |
| `npm run build:android:qa` | App bundle, `APP_ENV=qa` |
| `npm run build:android:prod` | App bundle, `APP_ENV=prod` |
| `npm run upload:ios` | Upload the built artifact to App Store Connect via the API key. Separate from the build so a failed upload does not mean rebuilding |

The iOS build scripts are the ones the GitHub Actions macOS runner calls
unchanged. That is why they are scripts now rather than instructions; see
`ci-cd.md`.

### Infrastructure

| Script | Does |
|---|---|
| `npm run infra:synth` | `cdk synth`. **Works with no credentials.** The bar for local work |
| `npm run infra:diff` | `cdk diff` against an environment. Needs credentials |
| `npm run infra:deploy` | Explicit, guarded, never automatic |

---

## 5. Git hooks

**Pre-commit must stay fast.** A hook that takes thirty seconds is a hook people
bypass with `--no-verify`, and then it protects nothing.

| Hook | Runs | Budget |
|---|---|---|
| pre-commit | lint-staged: Prettier and ESLint `--fix` on staged files only, plus gitleaks on the staged diff | Under 5 seconds |
| commit-msg | commitlint | Instant |
| pre-push | `npm run check` | Under 30 seconds |

Full tests do not run in a hook. They run in `verify` and in the pipeline. A hook
that runs the whole suite trains people to skip hooks.

---

## 6. What is deliberately not adopted

- **A monorepo build orchestrator such as Nx or Turborepo.** **Stale as of
  2026-09-02**: the shipped repo has a `turbo.json` and runs `turbo run lint
  typecheck test` / `turbo run build` in CI (`.github/workflows/ci.yml`).
  This line was written when the workspace was one app, one backend and one
  shared package; the workspace count has since grown (section 1), which is
  exactly the revisit trigger this line named. Treat Turborepo as adopted and
  update this line rather than reading it as current guidance.
- **Biome**, for now. Faster and does both jobs, but its React Native and Expo
  coverage is thinner and `eslint-config-expo` does not transfer. Worth watching.
- **Changesets or semantic-release.** Nothing is published to a registry. Version
  bumps are a build-number concern, handled in the pipeline.
- **Storybook.** Real value for a design system, and the design system here is
  six primitives against frames that are still moving. Revisit when the UI settles.
- **A native E2E runner.** See section 2.
