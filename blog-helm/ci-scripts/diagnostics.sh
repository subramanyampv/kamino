#!/bin/bash
set -ex

if [ -x "$(command -v lsb_release)" ]; then
  lsb_release -cdir
fi

docker version
pwd
id
git --version
