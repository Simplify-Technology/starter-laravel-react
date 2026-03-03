#!/usr/bin/env sh
set -e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

cd "$REPO_ROOT"

BRANCH_NAME="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"

if [ -z "$BRANCH_NAME" ] || [ "$BRANCH_NAME" = "HEAD" ]; then
  exit 0
fi

BRANCH_BASENAME="${BRANCH_NAME##*/}"

# Prefer Jira-like IDs: PRO-123
ISSUE_ID="$(printf '%s' "$BRANCH_BASENAME" | sed -nE 's/^([A-Z][A-Z0-9]*-[0-9]+)(-|$).*/\1/p')"

if [ -z "$ISSUE_ID" ]; then
  # Numeric IDs: 12345-minha-feature (avoid false positives like dates)
  ISSUE_ID="$(printf '%s' "$BRANCH_BASENAME" | sed -nE 's/^([0-9]+)-[A-Za-z].*/\1/p')"
fi

if [ -n "$ISSUE_ID" ]; then
  printf '%s' "$ISSUE_ID"
fi
