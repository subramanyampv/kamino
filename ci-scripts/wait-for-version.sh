#!/bin/bash
#
# Wait until the version endpoint reports the expected version.
# Usage: wait-for-version.sh version-url expected-version
# Example: wait-for-version.sh http://some.host/version 1.3.0

VERSION_URL=$1
if [ -z "$VERSION_URL" ]; then
    >&2 echo "ERROR: first parameter should be version URL."
    exit 1
fi

EXPECTED_VERSION=$2
if [ -z "$EXPECTED_VERSION" ]; then
    >&2 echo "ERROR: second parameter should be the expected version."
    exit 1
fi

# how many times to retry
RETRY_COUNT=${RETRY_COUNT:-12}

# how many seconds to wait between retries
SLEEP_TIME=${SLEEP_TIME:-5}

n=0
until [ $n -ge $RETRY_COUNT ]
do
    echo "Waiting for url $VERSION_URL to be at version $EXPECTED_VERSION, attempt $n..."
    ACTUAL_VERSION=$(curl --connect-timeout 5 \
     --max-time 10 \
     --retry 5 \
     --retry-delay 5 \
     --retry-max-time 60 $VERSION_URL)
    if [ "$EXPECTED_VERSION" = "$ACTUAL_VERSION" ]; then
        echo "Version is correct!"
        exit 0
    fi

    echo "Version was $ACTUAL_VERSION"
    n=$[$n+1]
    sleep $SLEEP_TIME
done

>&2 echo "ERROR: expected version did not appear in time."
exit 1
