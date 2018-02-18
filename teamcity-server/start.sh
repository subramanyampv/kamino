#!/bin/sh

# Configure VMs to use host DNS
"$VBOX_MSI_INSTALL_PATH/VBoxManage" modifyvm "default" --natdnshostresolver1 on
"$VBOX_MSI_INSTALL_PATH/VBoxManage" modifyvm "minikube" --natdnshostresolver1 on

# Start docker VM

# Start minikube VM
minikube start

# Modify C:\Windows\System32\drivers\etc\hosts accordingly

# Start TeamCity
docker-compose up -d

# Provision docker

# Provision minikube
