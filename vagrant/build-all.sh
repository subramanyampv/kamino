#!/bin/bash

# Build prerequisite boxes
for DIR in k8s k8s-teamcity; do
    ./build-one.sh $DIR
done
