#!/bin/sh
# $1 -> kubectl config
# $2 -> app.env
# $3 -> build.number
mkdir -p $HOME/.kube
echo "$1" | base64 -d > $HOME/.kube/config
helm upgrade --install blog-helm-$2 \
    ./artifacts/blog-helm-$3.tgz \
    --set image.tag=$3 \
    --values ./artifacts/values-$2.yaml \
    --debug \
    --wait
