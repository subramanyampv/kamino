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
while [ -z "$(kubectl get nodes | grep -e '\bReady')" ]; do
    echo "Waiting for node to be ready"
    sleep 10
done

function waitForPod {
    local namespace=$1
    local name=$2
    while [ -z "$(kubectl get pods --namespace $namespace | grep $name | grep Running)" ]; do
        echo "Waiting for $name"
        sleep 10
    done
}

# Wait until kube-dns is running
waitForPod 'kube-system' 'kube-dns'

# Wait until kubernetes-dashboard is running
waitForPod 'kube-system' 'kubernetes-dashboard'

kubectl create serviceaccount dashboard -n kube-system
kubectl create clusterrolebinding dashboard-view --clusterrole=view --serviceaccount=kube-system:dashboard

echo "***** Dashboard token *****"
TOKEN_NAME=$(kubectl get serviceaccount dashboard -n kube-system -o yaml | grep token | sed 's/ //g' | cut -d: -f2)

echo "Token name: $TOKEN_NAME"

# extra echo "" for a newline at the end
kubectl get secret $TOKEN_NAME  -n kube-system -o yaml | grep 'token:' | sed 's/ //g' | cut -d : -f2 | base64 -d && echo ""

# Install Docker Registry
kubectl apply -f /vagrant/teamcity-server/registry.yaml

# Wait until Docker Registry is running
waitForPod 'default' 'registry'

# Install TeamCity Server
kubectl apply -f /vagrant/teamcity-server/teamcity-server.yaml

waitForPod 'default' 'teamcity-server'

# Build custom TeamCity Agent image
docker build -t custom-agent -f /vagrant/teamcity-server/Dockerfile-agent /vagrant/teamcity-server/

# Install TeamCity Agent
kubectl apply -f /vagrant/teamcity-server/teamcity-agent.yaml

waitForPod 'default' 'teamcity-agent'

# # Install Jenkins
# mkdir -p /var/jenkins_home
# chown -R 1000:1000 /var/jenkins_home
# kubectl apply -f /vagrant/teamcity-server/jenkins.yaml

# # Pull this big image
# docker pull gittools/gitversion:v4.0.0-beta.12
