#!/bin/bash
namespace=$1
name=$2
count=$3
PATTERN="$name-.*$count/$count\s*Running"
while [ -z "$(kubectl get pods --namespace $namespace | grep -e "$PATTERN")" ]; do
    echo "Waiting for $name"
    sleep 10
done
