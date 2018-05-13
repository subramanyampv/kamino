# Overview

This folder contains Vagrant boxes for setting up Kubernetes and TeamCity.

# Building

Build the boxes in the following order:

- `k8s` (provides Kubernetes on top of Ubuntu)
- `k8s-teamcity` (provides TeamCity Server and Agent, as well as a custom Docker registry, all running within Kubernetes)
- `k8s-teamcity-blog-helm` (use this)

Each box builds on top of the previous one. The reason is to avoid lengthy downloads
such as Docker images and apt packages.

To build a prerequisite box:

```
vagrant up
vagrant package --output $(basename $PWD).box
vagrant box add $(basename $PWD) $(basename $PWD).box
vagrant destroy
```

Or to simply build all prerequisite boxes, run `build-all.sh`.

# Using

After having built the prerequisite boxes, run `vagrant up` inside the `k8s-teamcity-blog-helm` folder.

You will need to configure TeamCity on http://localhost:30200/ the first time.
