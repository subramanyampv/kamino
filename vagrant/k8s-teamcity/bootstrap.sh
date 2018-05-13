#!/usr/bin/env bash

# Wait until kubernetes is up and running
wait-for-pod.sh 'kube-system' 'kube-dns' 3

# Create certificate for custom Docker Registry (registry.default.svc.cluster.local)
mkdir -p /certs
openssl req -newkey rsa:4096 -nodes -sha256 \
    -keyout /certs/registry.default.svc.cluster.local.key \
    -x509 -days 365 \
    -out /certs/registry.default.svc.cluster.local.crt \
    -subj "/C=NL/ST=Noord Holland/L=Amsterdam/CN=registry.default.svc.cluster.local"

# Convince local docker to trust this certificate
mkdir -p /etc/docker/certs.d/registry.default.svc.cluster.local:5000
cp /certs/registry.default.svc.cluster.local.crt /etc/docker/certs.d/registry.default.svc.cluster.local:5000/ca.crt

# Get local IP address
IP=$(ifconfig cni0 | grep 'inet addr' | cut -d: -f2 | cut -d\  -f1)
while [ -z "$IP" ]; do
    echo "Waiting for interface cni0 to become available"
    sleep 10
    IP=$(ifconfig cni0 | grep 'inet addr' | cut -d: -f2 | cut -d\  -f1)
done

# Needed for docker daemon to publish to local registry
echo "$IP registry.default.svc.cluster.local" >> /etc/hosts

# Install Docker Registry
kubectl apply -f /vagrant/registry.yaml

# Wait until Docker Registry is running
wait-for-pod.sh 'default' 'registry' 1

# Install TeamCity Server
docker pull jetbrains/teamcity-server:2017.2.3
kubectl apply -f /vagrant/teamcity-server.yaml
wait-for-pod.sh 'default' 'teamcity-server' 1

# Build custom TeamCity Agent image
docker build -t custom-agent -f /vagrant/Dockerfile-agent /vagrant/

# Install TeamCity Agent
kubectl apply -f /vagrant/teamcity-agent.yaml
wait-for-pod.sh 'default' 'teamcity-agent' 1
