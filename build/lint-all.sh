#!/usr/bin/env bash
set -e

# List all unignored files.
{ git ls-files -z --cached --others --exclude-standard || exit $?; } |
{ grep -v --null 'fixture' || exit $?; } |
# Clean environment for Windows pipeline
{ xargs "$(dirname "$0")/lint.sh" "$@" || exit $?; }
