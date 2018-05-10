# Setup with Minikube

- Start minikube with `minikube start --vm-driver virtualbox`
- Verify everything looks okay with `minikube dashboard`
- Run TeamCity with `kubectl apply -f teamcity.yml`
