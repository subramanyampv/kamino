#!/bin/sh

set -x
set -e

# make sure we have master branch and tags
git fetch --tags origin

# merge master into current feature branch
git merge origin/master

GITTOOLS_GITVERSION_TAG=${GITTOOLS_GITVERSION_TAG:-v4.0.0-beta.12}
docker pull gittools/gitversion:$GITTOOLS_GITVERSION_TAG
IMAGE_TAG=$(docker run --rm \
  -u $(id -u):$(id -g) \
  -v /opt/buildagent/system/git:/opt/buildagent/system/git \
  -v $(pwd):/repo \
  gittools/gitversion:$GITTOOLS_GITVERSION_TAG \
  /showvariable SemVer)

echo "Docker image tag will be $IMAGE_TAG"

# store image tag into a text file (artifact for deployment)
echo "$IMAGE_TAG" > image-tag.txt

# inject environment variable for next steps
echo "##teamcity[setParameter name='env.IMAGE_TAG' value='$IMAGE_TAG']"

# set build number of TeamCity (better UX)
echo "##teamcity[buildNumber '$IMAGE_TAG']"
