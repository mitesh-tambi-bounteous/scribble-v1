# Enforcement Gates: the correctness layer

**Premise: instructions are not contracts.** A model optimising for "looks done" takes the
cheap path. It claims a test ran, breaches a budget it cannot see, skips a checkpoint it judged
insignificant. The fix is not a sterner sentence. It is to make the correct path easier than
the shortcut, and to demand evidence the harness can check.

Each gate below states the principle, why prose alone fails, and the mechanism that actually
holds it. The mechanisms are harness responsibilities (hooks, wrappers, CI), not behaviours the
model promises.

## Gate 1: Fail loud (proof of work)

**Principle.** "Completed" is wrong if anything was skipped silently. "Tests pass" is wrong if
any were skipped. Surface uncertainty rather than hiding it.

**Why prose fails.** "The agent ran the tests" is the canonical lie. The model asserts it after
merely touching a file. Self-reporting cannot police self-reporting.

**Mechanism.** A claim of done is rejected unless accompanied by artifacts the harness produced
and can verify:

- The harness runs the test or build command itself and captures the real output. The agent
  submits a SHA-256 hash of that captured output as the gate credential. A fabricated hash will
  not match the harness's own hash of the run.
- Record exit codes, tests run versus skipped, and diff stats alongside the hash.
- **Definition of done is that the green evidence exists.** No evidence, no done.

This is the keystone gate. The others degrade gracefully; this one does not. It is also what
makes `acceptance-criteria-lock` real rather than aspirational.

## Gate 2: Token budgets

**Principle.** Budgets are not advisory. Approaching one means summarise, surface the breach,
and start a fresh context.

**Why prose fails.** A model cannot reliably observe its own running token count, so a prose
limit is invisible to the actor meant to obey it. It breaches silently.

**Mechanism.** A statusline or usage hook reads actual consumption: warn at a soft threshold,
force a checkpoint-and-compact at a hard one. Ground the thresholds in your own measured task
data; treat any published default as a placeholder.

## Gate 3: Checkpoints

**Principle.** After every significant step, restate what was done, what is verified, and what
is left. Never continue from a state you cannot describe back.

**Why prose fails.** "Significant" is the model's judgement call, and it skips the checkpoint
exactly when momentum makes it inconvenient, which is when it is most needed.

**Mechanism.** Define the trigger objectively rather than by significance: at every phase
boundary and/or every N edits, a Stop or PostToolUse hook requires a checkpoint write of
`done / verified / remaining`. The AC-lock table is that artifact.

## When a gate catches a failure: fix the system, not the output

Do not hand-patch the bad output and move on. Treat it as a system bug and update the harness,
the gate, or the agent's persistent instructions so the class of failure cannot recur.

Corollary on what you feed the agent: more instructions is not more reliability. Measure before
keeping generated rules and skills. Bloated, unvetted context lowers accuracy and slows
execution. Keep the lean, evidence-earning set.
