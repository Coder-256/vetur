set -e
npx ts-node "$(dirname "$0")/lint.ts" "$@"
