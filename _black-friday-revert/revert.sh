#!/bin/bash
# Reinstate the free trial. PREFERRED: use git (keeps any later changes):
#   git revert -m1 <merge-sha>      (or: git revert <commit-sha>, see README)
# This script is the fallback: it overwrites every touched file with its pre-change
# version from originals/. Any edits made to those files since 17 Nov will be lost.
set -e
cd "$(dirname "$0")/.."
O=_black-friday-revert/originals
( cd $O && find . -type f ) | while read f; do cp "$O/$f" "./$f"; done
echo "Restored from originals/. Now run: npx tsc --noEmit -p . and redeploy."
