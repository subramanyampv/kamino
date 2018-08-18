#!/bin/sh
set -e

while [ -n "$1" ]; do case $1 in
    --kube-config )
        shift; KUBE_CONFIG=$1
        ;;
    --env )
        shift; APP_ENV=$1
        ;;
    --tag )
        shift; IMAGE_TAG=$1
        ;;
esac; shift; done
if [[ "$1" == '--' ]]; then shift; fi

if [ -z "$KUBE_CONFIG" ]; then
    >&2 echo "Error: missing parameter KUBE_CONFIG"
    exit 1
fi

if [ -z "$APP_ENV" ]; then
    >&2 echo "Error: missing parameter APP_ENV"
    exit 1
fi

if [ -z "$IMAGE_TAG" ]; then
    >&2 echo "Error: missing parameter IMAGE_TAG"
    exit 1
fi

mkdir -p $HOME/.kube
echo "$KUBE_CONFIG" | base64 -d > $HOME/.kube/config
helm upgrade --install blog-helm-${APP_ENV} \
    ./artifacts/blog-helm-${IMAGE_TAG}.tgz \
    --set image.tag=${IMAGE_TAG} \
    --values ./artifacts/values-${APP_ENV}.yaml \
    --debug \
    --wait
