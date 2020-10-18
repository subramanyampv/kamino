#!/bin/bash
set -ex

BASE_URL=$1
DNS_SEARCH=$(cat /etc/resolv.conf | grep search | cut -d\  -f2)
DNS=$(cat /etc/resolv.conf | grep nameserver | cut -d\  -f2)

CURRENT_CONTAINER_ID=$(head -1 /proc/self/cgroup | tr '/' '\n' | tail -1)
if [ -n "$CURRENT_CONTAINER_ID" ]; then
  docker run --rm -w $PWD --volumes-from=$CURRENT_CONTAINER_ID \
    --dns $DNS \
    --dns-search $DNS_SEARCH \
    -e CI=1 \
    ngeor/node-chrome:v77.0.3865.120 \
    npm run wdio -- --baseUrl $BASE_URL
else
  docker run --rm -w /code -v $PWD:/code \
    --dns $DNS \
    --dns-search $DNS_SEARCH \
    -e CI=1 \
    ngeor/node-chrome:v77.0.3865.120 \
    npm run wdio -- --baseUrl $BASE_URL
fi
