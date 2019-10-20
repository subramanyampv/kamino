#!/bin/bash
# Ensure the current branch is ahead of master.
# If the current branch conflicts with master branch, the build will fail.
set -ex

# Prevent host key verification error
mkdir -p ~/.ssh
ssh-keyscan -H github.com > ~/.ssh/known_hosts

IS_SHALLOW=$(git rev-parse --is-shallow-repository)
if [[ "$IS_SHALLOW" == "true" ]]; then
  GIT_FETCH_ARGS="--unshallow"
else
  GIT_FETCH_ARGS=""
fi

# make sure we have master branch and tags
# fetching tags will allow GitVersion to operate correctly
git fetch $GIT_FETCH_ARGS --tags origin

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  # merge master into current feature branch
  git merge origin/master
fi
