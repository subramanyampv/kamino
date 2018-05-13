#!/usr/bin/env bash
# https://kubernetes.io/docs/setup/independent/install-kubeadm/
# Swap disabled. You MUST disable swap in order for the kubelet to work properly.
swapoff -a

# Add kubernetes source
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
    deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF

# Update and install
apt-get update
apt-get install -y docker.io apt-transport-https kubelet kubeadm kubectl

# Allow vagrant user to run docker
adduser vagrant docker

# Setup kubernetes
kubeadm init --pod-network-cidr=10.244.0.0/16

# Configure cgroup driver used by kubelet on Master Node
cat <<EOF >>/etc/systemd/system/kubelet.service.d/10-kubeadm.conf
Environment="KUBELET_EXTRA_ARGS=--cgroup-driver=cgroupfs"
EOF
systemctl daemon-reload
systemctl restart kubelet

# Allow vagrant user to run kubectl
mkdir -p /home/vagrant/.kube
cp /etc/kubernetes/admin.conf /home/vagrant/.kube/config
chown -R vagrant:vagrant /home/vagrant/.kube

# Allow root user to run kubectl
mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config

# Install pod network
sysctl net.bridge.bridge-nf-call-iptables=1
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.10.0/Documentation/kube-flannel.yml

# Allow pods to run on master node
kubectl taint nodes --all node-role.kubernetes.io/master-

# Add dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml

# Wait until nodes are ready
wait-for-node.sh

# Wait until kube-dns is running
wait-for-pod.sh 'kube-system' 'kube-dns' 3

# Wait until kubernetes-dashboard is running
wait-for-pod.sh 'kube-system' 'kubernetes-dashboard' 1

# Create a service account named dashboard
kubectl create serviceaccount dashboard -n kube-system

# Add it to the view cluster role
kubectl create clusterrolebinding dashboard-view --clusterrole=view --serviceaccount=kube-system:dashboard

# Print its token
print-dashboard-token.sh

# cleanup a bit
apt-get clean
