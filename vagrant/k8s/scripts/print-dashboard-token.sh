#!/bin/bash
echo "***** Dashboard token *****"
TOKEN_NAME=$(kubectl get serviceaccount dashboard -n kube-system -o yaml | grep token | sed 's/ //g' | cut -d: -f2)
echo "Token name: $TOKEN_NAME"
echo "Token:"
kubectl get secret $TOKEN_NAME  -n kube-system -o yaml | grep 'token:' | sed 's/ //g' | cut -d : -f2 | base64 -d
echo ""
