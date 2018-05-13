#!/usr/bin/env bash

# Get local IP address
IP=$(ifconfig cni0 | grep 'inet addr' | cut -d: -f2 | cut -d\  -f1)
while [ -z "$IP" ]; do
    echo "Waiting for interface cni0 to become available"
    sleep 10
    IP=$(ifconfig cni0 | grep 'inet addr' | cut -d: -f2 | cut -d\  -f1)
done

# Needed for docker daemon to publish to local registry
cat /etc/hosts | grep -v registry.default.svc.cluster.local > tmp-hosts
mv tmp-hosts /etc/hosts
echo "$IP registry.default.svc.cluster.local" >> /etc/hosts

wait-for-pod.sh 'kube-system' 'kube-dns' 3
wait-for-pod.sh 'default' 'registry' 1
wait-for-pod.sh 'default' 'teamcity-server' 1
wait-for-pod.sh 'default' 'teamcity-agent' 1
