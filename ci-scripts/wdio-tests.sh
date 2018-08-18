#!/bin/bash
# This script is supposed to be run with the Dockerfile-ci image

set -ex

while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do case $1 in
    --url )
        shift; URL=$1
        ;;
    --host )
        shift; ENV_HOST=$1
        ;;
    --ip )
        shift; IP=$1
        ;;
esac; shift; done
if [[ "$1" == '--' ]]; then shift; fi

if [ -z "$IP" ]; then
    >&2 echo "Error: missing parameter IP (use --ip minikube-ip)"
    exit 1
fi

if [ -z "$URL" ]; then
    >&2 echo "Error: missing parameter URL"
    exit 1
fi

if [ -z "$ENV_HOST" ]; then
    >&2 echo "Error: missing parameter ENV_HOST"
    exit 1
fi

# hosts workaround
echo "$IP $ENV_HOST" >> /etc/hosts

# run tests
npm run wdio -- -b $URL
