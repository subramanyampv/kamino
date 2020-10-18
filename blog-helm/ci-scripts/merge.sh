#!/bin/bash
# Ensure the current branch is ahead of master.
# If the current branch conflicts with master branch, the build will fail.
set -ex

# Prevent host key verification error
mkdir -p ~/.ssh
ssh-keyscan -H github.com > ~/.ssh/known_hosts

# make sure we have master branch and tags
# fetching tags and master branch will allow GitVersion to operate correctly

if [ -z "$JENKINS_URL" ]; then
  # for Jenkins, we already have the full git info
  git fetch
  git fetch --tags
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  # merge master into current feature branch
  git merge origin/master
fi
