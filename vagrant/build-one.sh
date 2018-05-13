#!/bin/bash

DIR=$1
if [ ! -d "$DIR" ]; then
    echo "Parameter $DIR needs to be a directory"
    exit 1
fi

if [ ! -r "$DIR/Vagrantfile" ]; then
    echo "Directory $DIR does not contain a Vagrantfile"
    exit 1
fi

echo "Building $DIR"
pushd $DIR
vagrant up
vagrant package --output $(basename $PWD).box
vagrant box add $(basename $PWD) $(basename $PWD).box
vagrant destroy
popd
