# Parallel Task Execution

## Variables

PLAN_TO_EXECUTE: $ARGUMENTS
NUMBER_OF_PARALLEL_WORKTREES: $ARGUMENTS

## Run these commands first

RUN `ls -la trees/`
RUN `git worktree list`
READ: PLAN_TO_EXECUTE

## Instructions

Create NUMBER_OF_PARALLEL_WORKTREES subagents. Each agent:

- Works in trees/<feature_name>-1/, -2/, -3/
- Implements PLAN_TO_EXECUTE independently
- Saves a RESULTS.md describing its approach
Do not start dev servers automatically; focus on code and tests only.
