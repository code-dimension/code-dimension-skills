# Coordination Protocol

Use this protocol for the first assignment, continuations, checkpoints, and
reviews. Keep messages compact and point to authoritative files instead of
copying them.

## Context Packet

Every new worker receives:

```text
Objective:
  One concrete outcome.

Authorized scope:
  Exact tasks and allowed files or roots.

Authoritative context:
  Paths to instructions, specs, designs, and relevant source.

Recorded decisions:
  Only decisions not obvious from those files.

Preserve:
  Dirty work, accepted debt, compatibility, or behavior that must remain.

Stop conditions:
  Ambiguity, unexpected consumers, failed prerequisite, or boundary conflict.

Validation ownership:
  Check IDs owned by this worker.

Current ledger:
  Only relevant valid, invalid, or baseline entries.

Report:
  Tasks, changed files, decisions, ledger updates, risks, and task state.
```

Do not include command transcripts, entire file contents, general repository
history, or validation unrelated to the assignment. A continuation sends only
new decisions, invalidated ledger entries, and the next objective.

## Validation Ledger

Each entry has one line of evidence:

```text
<check-id> | owner=<agent> | scope=<inputs> | result=<pass|fail|baseline|blocked> | evidence=<short result> | invalidated-by=<none|change>
```

Example:

```text
server-api:test | owner=implementer | scope=hotmart controller and imports | result=pass | evidence=79 suites, 505 tests | invalidated-by=none
workspace:lint | owner=coordinator | scope=all resolved Nx projects | result=baseline | evidence=Website and Dashboard only | invalidated-by=none
guidance:format | owner=implementer | scope=4 Markdown files | result=pass | evidence=Prettier clean | invalidated-by=none
```

Rules:

- Reuse an entry while its scope inputs are unchanged.
- A failure fix invalidates the failed check and downstream checks that depend
  on the edited input, not unrelated evidence.
- Documentation-only changes invalidate documentation formatting/link checks,
  not runtime tests.
- Configuration changes invalidate only projects or probes governed by that
  configuration until the final integration gate.
- A reviewer may challenge an entry with concrete evidence. Otherwise it does
  not rerun the same full command merely for independence.
- Full lint, test, build, graph, or sync belongs to one final integration owner
  unless the specification explicitly requires distinct executions.

## Checkpoint Report

Return only:

```text
Completed tasks:
Changed files:
Material decisions:
Ledger updates:
Baseline or blockers:
Remaining task state:
```

For a failure, include the first actionable error and the command identity, not
the full log. Store or reference a durable artifact only when later agents
need the complete output.
