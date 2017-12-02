#!/bin/sh

set -x
set -e

GIT_SHA=$(git rev-parse HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
APP_VERSION=$(cat package.json  | grep version | cut -d\" -f 4)

if [ "$GIT_BRANCH" = "master" ]; then
  IMAGE_TAG="$APP_VERSION"
else
  IMAGE_TAG="$APP_VERSION-$GIT_SHA"
fi

echo "Docker image tag will be $IMAGE_TAG"

# store image tag into a text file (artifact for deployment)
echo "$IMAGE_TAG" > image-tag.txt

# inject environment variable for next steps
echo "##teamcity[setParameter name='env.IMAGE_TAG' value='$IMAGE_TAG']"
