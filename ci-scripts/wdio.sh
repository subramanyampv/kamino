#!/bin/bash
set -ex

BASE_URL=$1
DNS_SEARCH=$(cat /etc/resolv.conf | grep search | cut -d\  -f2)
DNS=$(cat /etc/resolv.conf | grep nameserver | cut -d\  -f2)

docker run --rm -w /code -v $PWD:/code \
  --dns $DNS \
  --dns-search $DNS_SEARCH \
  -e CI=1 \
  ngeor/node-chrome:v77.0.3865.120 \
  npm run wdio -- --baseUrl $BASE_URL
