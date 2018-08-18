#!/bin/bash
# This script is supposed to be run with the Dockerfile-ci image

set -ex

while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do case $1 in
    --url )
        shift; URL=$1
        ;;
    --uid )
        shift; REPORTS_UID=$1
        ;;
    --gid )
        shift; REPORTS_GID=$1
        ;;
    --host )
        shift; ENV_HOST=$1
        ;;
    --ip )
        shift; IP=$1
        ;;
esac; shift; done
if [[ "$1" == '--' ]]; then shift; fi

# hosts workaround
echo "$IP $ENV_HOST" >> /etc/hosts

# run tests
npm run wdio -- -b $URL

# fix permissions on test reports
chown -R $REPORTS_UID:$REPORTS_GID test-reports
