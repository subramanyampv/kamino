#!/bin/bash
while [ -z "$(kubectl get nodes | grep -e '\bReady')" ]; do
    echo "Waiting for node to be ready"
    sleep 10
done
