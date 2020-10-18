#!/bin/bash
#
# Smoke test the production image.
#
set -e

# fully qualified image name
FQ_IMAGE_NAME=$1
if [ -z "$FQ_IMAGE_NAME" ]; then
    >&2 echo "ERROR: please provide the image to smoke test, e.g. $0 registry/image:tag"
    exit 1
fi

# start the application in the background and get the container ID
CONTAINER_ID=$(docker run -d $FQ_IMAGE_NAME)
CONTAINER_STATUS=

# how many times to retry
RETRY_COUNT=${RETRY_COUNT:-5}

# how many seconds to wait between retries
SLEEP_TIME=${SLEEP_TIME:-5}

function cleanup {
    echo "Stopping container $CONTAINER_ID"
    docker stop $CONTAINER_ID
    echo "Container logs:"
    docker container logs $CONTAINER_ID
    echo "Removing container $CONTAINER_ID:"
    docker container rm $CONTAINER_ID
}

function waitUntilItStarts {
    local n=0
    until [ $n -ge $RETRY_COUNT ]
    do
        echo "Waiting for container $CONTAINER_ID to start, attempt $n..."
        CONTAINER_STATUS=$(docker inspect -f {{.State.Running}} $CONTAINER_ID)
        if [ "$CONTAINER_STATUS" = "true" ]; then
            echo "Container $CONTAINER_ID started successfully"
            break
        fi

        n=$[$n+1]
        sleep $SLEEP_TIME
    done
}

function waitInCaseItDies {
    local n=0
    until [ $n -ge $RETRY_COUNT ]
    do
        echo "Waiting to make sure container $CONTAINER_ID stays running, attempt $n..."
        CONTAINER_STATUS=$(docker inspect -f {{.State.Running}} $CONTAINER_ID)
        if [ "$CONTAINER_STATUS" != "true" ]; then
            echo "Container $CONTAINER_ID is no longer running"
            break
        fi

        n=$[$n+1]
        sleep $SLEEP_TIME
    done
}

waitUntilItStarts

if [ "$CONTAINER_STATUS" != "true" ]; then
    >&2 echo "ERROR: Container $CONTAINER_ID did not start in a timely manner."
    cleanup
    exit 1
fi

waitInCaseItDies

if [ "$CONTAINER_STATUS" != "true" ]; then
    >&2 echo "ERROR: Container $CONTAINER_ID stopped unexpectedly."
    cleanup
    exit 1
fi

echo "Container $CONTAINER_ID passed smoke test, cleaning up"
cleanup
