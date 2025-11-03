#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   GH_TOKEN=ghp_xxx ./scripts/publish-to-github.sh <owner> <repo-name>
# or (with GitHub CLI already logged in):
#   ./scripts/publish-to-github.sh <owner> <repo-name>

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <owner> <repo-name>" >&2
  exit 64
fi
OWNER="$1"
REPO="$2"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Ensure we are in a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Initializing git repo..."
  git init -b main
  git add .
  git commit -m "Initial commit"
fi

REMOTE_URL="https://github.com/${OWNER}/${REPO}.git"

create_with_gh_cli() {
  if command -v gh >/dev/null 2>&1; then
    echo "Creating repo via GitHub CLI..."
    gh repo create "${OWNER}/${REPO}" --public --source . --remote origin --push || true
  else
    return 1
  fi
}

create_with_api() {
  if [[ -z "${GH_TOKEN:-}" ]]; then
    echo "GH_TOKEN not set; cannot use API fallback." >&2
    return 1
  fi
  echo "Creating repo via GitHub API..."
  curl -sSf -H "Authorization: token ${GH_TOKEN}" \
       -H "Accept: application/vnd.github+json" \
       https://api.github.com/user >/dev/null

  DATA=$(cat <<JSON
{"name":"${REPO}","private":false}
JSON
)
  curl -sSf -H "Authorization: token ${GH_TOKEN}" \
       -H "Accept: application/vnd.github+json" \
       -d "${DATA}" \
       https://api.github.com/user/repos >/dev/null

  if ! git remote | grep -q '^origin$'; then
    git remote add origin "${REMOTE_URL}"
  else
    git remote set-url origin "${REMOTE_URL}"
  fi
  echo "Pushing to ${REMOTE_URL}..."
  git push -u origin main
}

# Try gh CLI first, then API fallback
if ! create_with_gh_cli; then
  create_with_api
fi

echo "Done. Repo: ${REMOTE_URL}" 
