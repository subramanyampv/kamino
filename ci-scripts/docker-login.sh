#!/bin/bash
set -e

function showHelp {
    cat <<END
Usage: $0 [OPTIONS] [SERVER]

Login to a Docker registry.

Note: If server is not provided, no login will be attempted.

Options:
    -h, --help              Print usage
    -p, --password string   Password
    -u, --username string   Username
    --logout                Logout instead of logging in
END
}

while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do case $1 in
    -u | --username )
        shift; USERNAME=$1
        ;;
    -p | --password )
        shift; PASSWORD=$1
        ;;
    -h | --help )
        showHelp
        exit
        ;;
    --logout )
        LOGOUT=1
        ;;
    *)
        showHelp
        exit 1
        ;;
esac; shift; done
if [[ "$1" == '--' ]]; then shift; fi

SERVER=$1
if [ -z "$SERVER" ]; then
    echo "Server not provided, skipping login"
    exit
fi

if [ -n "$LOGOUT" ]; then
    docker logout $SERVER
    exit
fi

docker login -u $USERNAME -p $PASSWORD $SERVER
