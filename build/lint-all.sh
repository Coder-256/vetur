set -o pipefail

# List all unignored files.
git ls-files --cached --others --exclude-standard |
grep -v 'fixture' |
xargs "$(dirname "$0")/lint.sh" "$@"
