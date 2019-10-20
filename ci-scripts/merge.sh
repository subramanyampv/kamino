#!/bin/bash
# Ensure the current branch is ahead of master.
# If the current branch conflicts with master branch, the build will fail.
set -e

# TODO do not run for master branch

# TODO do not perform ssh-keyscan if github.com is already known

mkdir -p ~/.ssh
ssh-keyscan -H github.com > ~/.ssh/known_hosts

# make sure we have master branch and tags
# fetching tags will allow GitVersion to operate correctly
git fetch --tags origin

# merge master into current feature branch
git merge origin/master
