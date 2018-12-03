set -e

# List all unignored files.
{ git ls-files --cached --others --exclude-standard || exit $?; } |
{ grep -v 'fixture' || exit $?; } |
{ xargs "$(dirname "$0")/lint.sh" "$@" || exit $?; }
