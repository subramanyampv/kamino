#!/bin/bash
# Determine the current version.
# Supported strategy is controlled via the first parameter.

set -ex

VERSION_MODE=${1:-GitVersion}

# Default mode is GitVersion.
# It uses the GitVersion utility to determine the semantic version.
function gitVersion {
  if [ -x "$(command -v dotnet)" ]; then
    IMAGE_TAG=$(dotnet /app/GitVersion.dll /showvariable SemVer /nocache /nonormalize /nofetch)
  else
    docker pull gittools/gitversion:5.0.2-linux-ubuntu-18.04-netcoreapp3.0
    IMAGE_TAG=$(docker run --rm \
      -u $(id -u):$(id -g) \
      -v $(pwd):/repo \
      gittools/gitversion:5.0.2-linux-ubuntu-18.04-netcoreapp3.0 \
      /repo /showvariable SemVer /nocache /nonormalize /nofetch)
  fi
}

# In PackageJson mode, semantic version comes from package.json.
# If we're on a feature branch, the git SHA is appended as a suffix.
function packageJson {
  local GIT_SHA=$(git rev-parse HEAD)
  local GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  local APP_VERSION=$(grep version package.json | cut -d\" -f 4)

  if [ "$GIT_BRANCH" = "master" ]; then
    IMAGE_TAG="$APP_VERSION"
  else
    IMAGE_TAG="$APP_VERSION-$GIT_SHA"
  fi
}

# In TeamCity mode, we accept blindly the version as provided by TeamCity's
# %build.number% variable. This needs to be configured in TeamCity so it follows a SemVer format.
function teamCity {
  # first local parameter needs to be %build.number%
  if [ -z "$1" ]; then
    >&2 echo "Error: please supply the fully formatted build number as parameter. e.g. $0 $VERSION_MODE %build.number%"
    exit 1
  fi

  IMAGE_TAG="$1"
}

# In Hybrid mode, we take major.minor from package.json and patch from TeamCity's build counter.
function hybrid {
  # first local parameter needs to be %build.counter%
  if [ -z "$1" ]; then
    >&2 echo "Error: please supply the build counter as parameter. e.g. $0 $VERSION_MODE %build.counter%"
    exit 1
  fi
  local MAJOR=$(grep version package.json | cut -d\" -f 4 | cut -d. -f 1)
  local MINOR=$(grep version package.json | cut -d\" -f 4 | cut -d. -f 2)
  local PATCH="$1"
  IMAGE_TAG="$MAJOR.$MINOR.$PATCH"
}

case "$VERSION_MODE" in
  GitVersion)
    gitVersion
    ;;
  PackageJson)
    packageJson
    ;;
  TeamCity)
    teamCity "$2"
    ;;
  Hybrid)
    hybrid "$2"
    ;;
  *)
    >&2 echo "Error: Unsupported VERSION_MODE: $VERSION_MODE. VERSION_MODE needs to be set to one of GitVersion, PackageJson, TeamCity, Hybrid"
    exit 1
esac

# sanity check
if [ -z "$IMAGE_TAG" ]; then
  >&2 echo "Error: could not determine version"
  exit 1
fi

if [ -n "$TEAMCITY_VERSION" ]; then
  # Running in TeamCity
  # inject environment variable for next steps
  echo "##teamcity[setParameter name='env.IMAGE_TAG' value='$IMAGE_TAG']"

  # Set build number of TeamCity (better UX).
  # When mode is TeamCity that's already set.
  if [ "$VERSION_MODE" != "TeamCity" ]; then
    echo "##teamcity[buildNumber '$IMAGE_TAG']"
  fi
else
  # Not running in TeamCity
  echo "$IMAGE_TAG"
fi
