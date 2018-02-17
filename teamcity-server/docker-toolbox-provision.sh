#!/bin/bash

MACHINE=default

echo "Loading env for $MACHINE docker machine"
eval $(docker-machine env $MACHINE) || (echo "Unable to set machine $MACHINE env" && exit 1)

# create folder /etc/docker/certs.d/registry.local:5000
docker-machine ssh $MACHINE 'sudo mkdir -p /etc/docker/certs.d/registry.local:5000'

# Copy certificate to /etc/docker/certs.d/registry.local:5000/ca.crt (Convinces Docker to trust this certificate)

## copy certificate into machine as regular user
## note that scp has a bug with 0.13.0, using docker-machine 0.12.0 until it's fixed ( https://github.com/docker/machine/issues/4302 )
#docker-machine scp ./certs/registry.local.crt $MACHINE:
#
## move certificate into correct location as root
#docker-machine ssh $MACHINE 'sudo mv ~/registry.local.crt /etc/docker/certs.d/registry.local:5000/ca.crt'

# the following works on Windows and Mac (because /c/Users and /Users are mounted on the same paths inside the Docker machine)
docker-machine ssh $MACHINE "sudo cp $(pwd)/certs/registry.local.crt /etc/docker/certs.d/registry.local:5000/ca.crt"

# Add host aliases
IP=$(docker-machine ip)
docker-machine ssh $MACHINE "echo $IP registry.local | sudo tee -a /etc/hosts"
