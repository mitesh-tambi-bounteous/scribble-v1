# Developer machine setup, macOS

Everything a developer needs to go from a fresh Mac to a running Scribl app and
API. Written for the Sprint 0 dev-environment spike, whose stated artifact is a
documented setup plus a repository bootstrap that runs end to end.

Read section 0 first.

---

## 0. What works on day one

The stack is built local-first on purpose. **No cloud credential is needed to do
development.**

| Works with nothing but this guide | Needs a prerequisite |
|---|---|
| Run the app in the iOS Simulator | - |
| Run the app in a browser | - |
| Run the local API against local Postgres | - |
| Run the app against the contract mock, no database at all | - |
| Run the full test suite, the linter and the type checker | - |
| Build and run natively on the Simulator with a free personal Apple team | - |
| Synthesize the infrastructure templates | - |
| Build the backend container image | - |
| Install on a physical iPhone | Apple Developer team membership |
| Produce a signed build or use TestFlight | Apple Developer team membership |
| Deploy to a hosted environment | AWS account access |

Prerequisites and who provides them are in `release-readiness.md` section 1.
If you are blocked on the right-hand column you are not missing a tool, so do not
work around it by pointing at a personal account.

**Expected time to a running app:** roughly 3 to 5 hours, most of it the Xcode
download. Start that first and do everything else while it runs.

---

## 0b. The fast path: run the bootstrap script

Most of this guide is automated. Clone this repo, then:

```bash
./scripts/bootstrap.sh
```

**It is idempotent.** Every step checks its own state first and skips what is
already satisfied, so running it repeatedly is safe and cheap. It never
uninstalls, downgrades, or overwrites a file you may have edited. Run it again
after any manual step to confirm the result.

```bash
./scripts/bootstrap.sh --check          # report only, change nothing
./scripts/bootstrap.sh --with-android   # also set up the Android toolchain
./scripts/bootstrap.sh --force-deps     # reinstall npm dependencies
```

What it does: Homebrew, the Homebrew packages, Node 22 via fnm, the shell
profile, Xcode configuration where it can, Colima, git conventions, the sibling
repos, `.env`, npm dependencies, and Playwright browsers. It finishes with a
summary that separates what it changed, what was already present, what needs
you, and what failed.

**What it deliberately will not do:**

- **Install Xcode.** That is an App Store download and needs a human. The script
  detects it and tells you. Start it before anything else.
- **Install Docker Desktop.** It is commercially licensed above a published
  organisation size and Bounteous is above it, so the script installs Colima
  instead and says so.
- Touch a cloud account, deploy anything, or handle signing material.

**How it treats your shell profile**, since that is where scripts usually go
wrong. It writes a single managed file, `~/.scribl-dev.sh`, which it rewrites
wholesale on every run, and adds exactly one guarded block to your `.zshrc` that
sources it. Repeated runs cannot stack duplicate exports, and nothing the script
did not write is ever modified. Put your own customisations in your rc file, not
in the managed file.

**The script may need two passes**, and that is expected rather than a fault. If
Homebrew was missing, the tools it installs are not on your `PATH` until a new
shell starts. Open a new terminal and run it again.

The rest of this document is the manual walkthrough. Read it when the script
reports something it could not do, when you want to know why a choice was made,
or when you are debugging.

---

## 1. Machine baseline

| Requirement | Note |
|---|---|
| Apple Silicon Mac | M1 or newer. Intel works but is not what the team tests on |
| macOS Sonoma 14.5 or newer | Sequoia 15 recommended. Xcode's minimum OS moves with each release, so check before upgrading Xcode rather than after |
| 100 GB free disk minimum | Xcode plus simulator runtimes plus node_modules plus container images. 60 GB is not enough |
| 16 GB RAM minimum | Simulator plus Metro plus Postgres plus a browser is the working set |

```bash
sw_vers && uname -m && df -h /
```

`uname -m` must print `arm64`. If it prints `x86_64` you are in a Rosetta shell,
which causes confusing native-dependency failures later. Open a native terminal.

---

## 2. Start the Xcode download now

Xcode is 10 to 15 GB and the platform runtimes are more. Kick it off first.

Install Xcode from the App Store, or from Apple Developer downloads if you need a
specific version. Then:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
sudo xcodebuild -runFirstLaunch
xcode-select --install
```

Then open Xcode, go to Settings, then Platforms, and install the iOS platform
runtime. Recent Xcode versions do not bundle it, and a missing runtime is the
usual cause of "no simulators available".

**Check the required Xcode version against the Expo SDK 56 documentation before
assuming a newer one is fine.** React Native and Expo pin what they support, and
being ahead breaks as readily as being behind.

Install two simulators, not one. The device floor is **iPhone 11 and newer, phone
only**, so keep an iPhone 11 and a current iPhone available. A canvas that feels
good on the latest phone tells you nothing about the oldest supported one. Check
both before calling a screen done.

An iPad simulator is no longer needed. iPad left scope on 2026-08-26 when Rob
took phone first, on Eric Rice's answer at 00:52:26 to 00:52:45 of the
2026-08-25 kickoff, "Yes, just the closest start." Superseded 2026-08-26: this
page previously asked for three simulators including an iPad, because the
2026-08-24 architect position had iPad in scope.

Verify:

```bash
xcodebuild -version
xcrun simctl list devices available | head -20
```

---

## 3. Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

On Apple Silicon it installs to `/opt/homebrew` and prints two lines for your
shell profile. Run them, or add to `~/.zshrc`:

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

New terminal, then `brew --version && brew doctor`. Warnings are usually fine.
Errors are not.

---

## 4. Node 22

The pipeline runs Node 22 and the repos declare it.

```bash
brew install fnm
```

Add to `~/.zshrc`:

```bash
eval "$(fnm env --use-on-cd --shell zsh)"
```

Then:

```bash
fnm install 22
fnm default 22
```

With `--use-on-cd`, entering a repo with a `.node-version` or `.nvmrc` switches
automatically. If you already use `nvm`, that is fine; just make sure
`node --version` reports 22 inside the repo.

---

## 5. React Native toolchain

```bash
brew install watchman cocoapods
```

**Watchman** is Metro's file watcher. Without it, rebuilds are slow and
occasionally miss changes.

**CocoaPods** installs iOS native dependencies after `expo prebuild`. Install it
through Homebrew rather than system Ruby: macOS system Ruby is deprecated, and
gem installs against it on Apple Silicon are a known source of native-extension
failures. The Homebrew formula brings its own Ruby and removes the problem.

```bash
watchman --version && pod --version
```

---

## 6. Container runtime

Two things run in containers: local Postgres 15, and the backend API image the
pipeline builds.

**Check licensing before installing Docker Desktop.** It requires a paid
subscription for organisations above a published employee and revenue threshold,
and Bounteous is comfortably above it. Either confirm with IT that licences
exist, or use the alternative below.

The licence-safe default:

```bash
brew install colima docker docker-compose
colima start --cpu 4 --memory 8 --disk 60
```

Colima is open source and Docker-compatible, so the compose file and every
`docker` command work unchanged.

```bash
docker version && docker compose version && docker run --rm hello-world
```

Colima does not auto-start. Add `colima start` to your login items or run it
manually; "the database will not come up" is almost always a stopped Colima.

---

## 7. Git and repository access

```bash
git config --global user.name "Your Name"
git config --global user.email "your.name@bounteous.com"
git config --global pull.rebase true
git config --global init.defaultBranch main
```

Two hosts. `scribl-mobile-app` moved to the client's GitHub org 2026-08-27
(decision register 9.6), and `meta-scribl-app` (this repo) moved to the same
org 2026-09-02, as `ScriblOrg/meta-scribl-mobile-app`. Only `scribl-app`, the
POC and reference-only repo, stays on the HS2 Studio Bitbucket workspace. One
SSH key works for both hosts; add the same public key to each separately.

```bash
ssh-keygen -t ed25519 -C "your.name@bounteous.com"
pbcopy < ~/.ssh/id_ed25519.pub
```

Paste into Bitbucket under Personal settings, then SSH keys, and separately
into GitHub under Settings, SSH and GPG keys.

```bash
ssh -T git@bitbucket.org
ssh -T git@github.com
```

If Bitbucket rejects you, it is usually not the key. Repository access requires
membership of the HS2 Studio Bitbucket workspace, and a repository invitation on
its own is not enough. Ask on the team channel rather than retrying invitations.

If GitHub rejects you, it is a client-side access problem, not a key problem:
the client's GitHub org (`ScriblOrg`) is administered by their former dev
team, outside Scribl's current staff
(`knowledge/meetings/2026-08-26-standup.md`). Ask on the team channel who has
requested your invite.

---

## 8. Clone the repos as siblings

The scaffold prompt and tooling reference sibling paths, so the layout matters.

```bash
mkdir -p ~/work/scribl && cd ~/work/scribl

# The production repo, where you work. On the client's GitHub org since
# 2026-08-27 (decision register 9.6), confirmed 2026-09-02 as ScriblOrg.
git clone git@github.com:ScriblOrg/scribl-mobile-app.git

# The project brain: contract, plans, designs, open questions. On the
# client's GitHub org since 2026-09-02 (decision register 9.6).
git clone git@github.com:ScriblOrg/meta-scribl-mobile-app.git

# The POC, reference only. Do not port code from it
git clone git@bitbucket.org:hs2studio/scribl-app.git
```

Three plain clones, side by side. The brain used to vendor the app repo as a git
submodule and no longer does, so there is nothing to initialise and no pin to
keep current.

Where things live in the brain, since it was reorganised: `product/` is what we
are building (the spec, the design exports, the ADRs, the input artifacts),
`tracking/` is the board, roadmap, status and backlog, `handbook/` is how we
work, and `docs/` is the rendered site. Do not edit anything under `docs/`; it
is generated.

---

## 9. Install and run

From `scribl-mobile-app`:

```bash
cp .env.example .env
npm install
(cd backend && npm install)
npm run dev
```

`npm run dev` brings up the database container, applies the schema, seeds it
idempotently, then runs the API and the web app together.

Two things about `.env`. The database scripts refuse to run against any host that
is not local, naming the host they found, because a stale remote connection
string once wrote demo rows into a shared cloud database. And the default
configuration talks to the local API, since there is no hosted environment to
point at yet.

Native, on the Simulator:

```bash
npx expo run:ios
```

The first native run does a prebuild and a pod install and takes a while.
Subsequent runs are fast. A free personal Apple team is enough for the Simulator.

The backend container, the same image the pipeline builds:

```bash
docker build -t scribl-api ./backend
```

Quality gates. Two commands cover the day:

```bash
npm run check       # typecheck, lint, format, boundaries. Seconds. Run constantly
npm run verify      # check + tests + secrets + audit + web export. Before every push
```

`verify` mirrors the pipeline exactly. Individual scripts (`typecheck`, `lint`,
`boundaries`, `test`, `format`) all run standalone so you can fix one class of
problem at a time. The complete list is in `toolchain.md` section 4.

**A green local run is not a green pipeline** if the two have drifted. If `verify`
passes and CI fails, that is a bug in the pipeline definition worth fixing rather
than working around. See `ci-cd.md`.

---

## 10. Supporting tools

```bash
# AWS CLI
brew install awscli

# Playwright browsers for the end-to-end suite
npx playwright install chromium

# Claude Code, the team's build harness
npm install -g @anthropic-ai/claude-code

# Handy, not required
brew install jq gh
```

**AWS CLI**: when access exists, configure it with SSO rather than long-lived
access keys.

**AWS CDK** is a project dependency, not a global one. Use `npx cdk` from
`infra/` so everyone runs the same version. `cdk synth` works with no
credentials, which is the bar for local work.

**Claude Code**: sign in with your Bounteous enterprise account and request the
developer tier for the larger token budget.

Editor: VS Code or Cursor, with the ESLint, Prettier, Tailwind CSS IntelliSense
and Expo Tools extensions. Enable format on save so formatting never shows up in
a review diff.

---

## 11. Android, when it starts

Android is a fast follow, so this is optional today. Doing it now costs an hour
and saves re-running setup later.

```bash
brew install --cask temurin@17
brew install --cask android-studio
```

Run the Android Studio setup wizard and install the SDK plus an emulator image.
Add to `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
```

Verify with `adb --version`, then `npx expo run:android`.

---

## 12. Verification checklist

The quickest version is `./scripts/bootstrap.sh --check`, which reports on all of
the below and changes nothing. Run the raw commands when you want to see the
actual output rather than a verdict.

Every line should succeed before you pick up a work item.

```bash
sw_vers                                   # macOS 14.5 or newer
uname -m                                  # arm64
xcodebuild -version
xcrun simctl list devices available        # at least one simulator
brew --version
node --version                            # v22.x
watchman --version
pod --version
docker run --rm hello-world
ssh -T git@bitbucket.org
ssh -T git@github.com
```

Then from `scribl-mobile-app`:

```bash
npm run verify                # typecheck, lint, test, web export: all green
npm run dev                   # app loads in a browser, no connection error
npx expo run:ios              # app launches in the Simulator
docker build -t scribl-api ./backend
```

---

## 13. Access checklist, not tools

Tooling is the easy half. Chase these on day one.

| Access | Note |
|---|---|
| HS2 Studio Bitbucket workspace | Required for `meta-scribl-app` and `scribl-app`. Any repository invitation needs this first |
| Client's GitHub org (`ScriblOrg`) | Required for `scribl-mobile-app`, moved here 2026-08-27 (decision register 9.6). Administered by the client's former dev team, outside current Scribl staff; ask on the team channel who is requesting access on your behalf |
| Jira, project SCRIBL | Board 13809 |
| Confluence | The handbook source |
| Lucid | The kickoff board and architecture diagrams live here |
| Claude enterprise, developer tier | Request the developer tier for the token budget |
| AWS account access | For anyone doing infrastructure work. Not needed for feature development |
| Apple Developer team | For anyone producing signed builds. Not needed for Simulator work |
| Figma | We hold 23 PNG exports. File access is still outstanding, and exports go stale on every edit |

---

## 14. Troubleshooting

**"No simulators available".** The iOS platform runtime is not installed. Xcode,
Settings, Platforms.

**`xcode-select` points at the command line tools instead of Xcode.** Re-run the
`--switch` command in section 2. Symptom is native builds failing on missing SDKs
while plain compilation works.

**Pod install fails on a native extension or architecture.** Usually a Rosetta
shell; check `uname -m` prints `arm64`. Failing that, `pod repo update` and retry.

**Metro serves stale code.** `npx expo start --clear`. If it persists,
`watchman watch-del-all`.

**Database will not come up.** Colima is not running. `colima status`, then
`colima start`.

**Port already in use.** Postgres 5433, web and Metro 8081, API 8787. Find the
offender with `lsof -nP -iTCP:8081 -sTCP:LISTEN`.

**The database scripts refuse to run and name a host.** The guard is working as
designed. Your `.env` points somewhere that is not local. Fix the connection
string rather than setting the override, unless you genuinely mean to target a
remote database.

**Node version errors on install.** `node --version` must report 22 inside the
repo. If `fnm` is not switching, confirm the `eval` line is in `~/.zshrc` and open
a new terminal.

**Wrong Xcode after an OS or Xcode update.** Re-run `xcode-select --switch` and
`sudo xcodebuild -runFirstLaunch`. Updates routinely reset this.

**Crash reporting does nothing locally.** Expected. Crashlytics collection starts
disabled and is enabled only after consent, and the local build reports to
nothing. Use the dev-only deliberate crash path to exercise the pipe.

---

## 15. Keeping this document true

This is the artifact of the Sprint 0 dev-environment spike, whose whole point is
that repository access, toolchain and a running local build are each a way the
engagement fails before any feature work starts.

If you hit something this guide did not cover, fix the guide **and the script** in
the same unit of work. A setup document that is wrong on day one costs every
subsequent joiner the same hour, and a fix that lives only in the prose gets
skipped by everyone who runs the script instead.

Two rules for editing `developer-bootstrap.md`:

- **Every step checks before it acts.** If a step cannot be made idempotent,
  it does not belong in the script; make it a `warn` that tells the developer
  what to do.
- **Write for bash 3.2**, which is what macOS ships. No associative arrays, no
  `mapfile`, no `${var^^}`. `bash -n scripts/bootstrap.sh` before you commit.

If you hit something that needs a decision rather than a fix, add it to
`code-questions.md` at the repo root instead of solving it locally and privately.
