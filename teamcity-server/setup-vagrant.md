# Setup with Vagrant

## Starting up
- Start the virtual machine with `vagrant up`
- Connect with `vagrant ssh`
- Wait until master node is ready with `kubectl get nodes -w`
- Proxy the dashboard with `kubectl proxy --address='0.0.0.0'`
- [Browse the dashboard](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/overview?namespace=default)
