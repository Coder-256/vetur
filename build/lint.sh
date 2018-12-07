#!/usr/bin/env bash
set -e

npx ts-node "$(dirname "$0")/lint.ts" "$@"
