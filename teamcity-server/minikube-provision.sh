#!/bin/bash
minikube addons enable ingress
helm init

# punch hole into tiller with tiller-nodeport.yaml
kubectl apply -f tiller-nodeport.yaml

minikube ssh 'sudo mkdir -p /etc/docker/certs.d/registry.local:5000'
minikube ssh "sudo cp $(pwd)/data/certs/registry.local.crt /etc/docker/certs.d/registry.local:5000/ca.crt"
