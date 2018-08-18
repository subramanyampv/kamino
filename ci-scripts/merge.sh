#!/bin/bash
# Ensure the current branch is ahead of master.
# If the current branch conflicts with master branch, the build will fail.
set -e

# make sure we have master branch and tags
# fetching tags will allow GitVersion to operate correctly
git fetch --tags origin

# merge master into current feature branch
git merge origin/master
