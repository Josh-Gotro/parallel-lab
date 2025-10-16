# Initialize Parallel Worktrees

## Variables

FEATURE_NAME: $ARGUMENTS
NUMBER_OF_TREES: $ARGUMENTS

## Instructions

Create NUMBER_OF_TREES git worktrees for parallel development of FEATURE_NAME.

RUN mkdir -p trees
RUN git worktree add trees/FEATURE_NAME-1 -b FEATURE_NAME-1
RUN git worktree add trees/FEATURE_NAME-2 -b FEATURE_NAME-2
RUN git worktree add trees/FEATURE_NAME-3 -b FEATURE_NAME-3
RUN git worktree list
