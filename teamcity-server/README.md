# Using TeamCity

This guide shows how to use TeamCity for the build pipeline.

This docker-compose file provides TeamCity Server & Agent and a Docker Registry.

## Setup

### Pull images

First, pull the images with:

```
docker-compose pull
```

It's going to take a while because the TeamCity images are large.

### Create self-signed certificate for registry

Generate the certificate for the hostname `registry.local`:

```
mkdir certs
openssl req \
  -newkey rsa:4096 -nodes -sha256 -keyout certs/registry.local.key \
  -x509 -days 365 -out certs/registry.local.crt
```

Make sure that the common name is set to `registry.local`:

```
Common Name (e.g. server FQDN or YOUR name) []:registry.local
```

### Configure HOSTS file

We need to configure two hosts, `teamcity.local` and `registry.local`.

- If you're using Docker, the IP should be 127.0.0.1 (localhost)
  ```
  127.0.0.1 teamcity.local
  127.0.0.1 registry.local
  ```
- If you're using Docker Toolbox, the IP should be the IP returned
  by `docker-machine ip` (e.g. 192.168.99.100)
  ```
  192.168.99.100 teamcity.local
  192.168.99.100 registry.local
  ```

  and in that case this needs to be applied also to Docker. Use the script `docker-toolbox-provision.sh`.


## First time run of TeamCity

Start with:

```
docker-compose up
```

Open your browser at http://teamcity.local:8111/ and answer the first
time usage questions. Select the internal HSQLDB database. Accept
the license and create your administrator account.

After you login, authorize the TeamCity Agent (it can take a while
for the agent to appear).

## Configure blog-helm in TeamCity

- Upload the private SSH key to TeamCity, so that it's possible to create git tags. Name it `ENVY` (as defined in git).
- Create the `blog-helm` project in TeamCity.
- Create the VCS root `blog-helm` under project `blog-helm`. Use the SSH clone URL. Set the branch specification to `+:refs/heads/*` to build on all branches.
- Enable versioned settings:
  - Synchronization Enabled
  - Use settings from VCS
  - Show settings changes in builds
  - Settings format Kotlin

Import settings from VCS. At this point, you'll see the pipeline
as expected.
