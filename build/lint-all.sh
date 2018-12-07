#!/usr/bin/env bash
set -e

# List all unignored files.
{ git ls-files --cached --others --exclude-standard || exit $?; } |
{ grep -v 'fixture' || exit $?; } |
{ npx ts-node -- "$(dirname "$0")/lint.ts" --stdin "$@" || exit $?; }
