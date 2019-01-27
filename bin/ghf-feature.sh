#!/bin/bash

set -e
set -x

git checkout master
git fetch -p -t && git pull

git checkout -b $1

npm --no-git-tag-version version patch

git commit -am "Version bump"
git push -u origin $1

