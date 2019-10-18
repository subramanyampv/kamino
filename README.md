# blog-helm

An example hello world application to show Docker and Helm

## Standalone usage

| Command         | Action                |
| --------------- | --------------------- |
| `npm i`         | Install dependencies  |
| `node index.js` | Run the application   |
| `npm run lint`  | Lint the app          |
| `npm test`      | Run the unit tests    |
| `npm start`     | Start the application |
| `npm run wdio`  | Run the browser tests |

### WebdriverIO

To run tests against an app that already runs on http://localhost:3000/ :

```
npm run wdio
```

To run tests against an app at a different base URL:

```
npm run wdio -- -b http://some.other.url/
```

## Docker usage

Build the production Docker image with:

```
docker build -t blog-helm .
```

Run the app with:

```
docker run -p 3000:3000 blog-helm
```

To lint the app using Docker:

```
docker run --rm -v $(pwd):/src -w /src node:8-jessie npm run lint
```

For the XML report:

```
docker run --rm -v $(pwd):/src -w /src node:8-jessie npm run lint-junit
```

Correct user permissions if needed with:

```
docker run --rm -v $(pwd):/src -w /src node:8-jessie chown -R $(id -u):$(id -g) test-reports
```

## CI Pipeline

TODO improve section

- Linting (ESLint)
- Unit tests with code coverage (mocha/nyc)
- Browser tests (webdriver io)
- Smoke test Docker image

## Versioning and GitVersion

TODO

## Setting up minikube

### Using TeamCity

This guide shows how to use TeamCity for the build pipeline. We setup TeamCity
inside minikube. This has the advantage of not having to setup a Docker
registry.

### Minikube

Install minikube and start a new cluster with `minikube start`.

**Consider configuring at least 4GB or RAM for the VM. The default 2GB is not
enough.**

Enable the addons dashboard, heapster and ingress.

Install the server-side component of Helm with `helm init`.

### Install TeamCity

Install TeamCity using the helm chart in `./helm/teamcity`.

```
helm install ./helm/teamcity
```

You'll need to edit your HOSTS file to point `teamcity.local` to your local host
(or whatever `minikube ip` returns).

### Configure TeamCity

Visit http://teamcity.local/ to configure TeamCity.

- create admin account
- upload SSH key named "ENVY" which can read/write the git repository
- create TeamCity project named "Blog Helm" (id should be BlogHelm)
- create VCS root for URL `git@github.com:ngeor/blog-helm.git`
  - name "Blog Helm"
  - id "BlogHelm_BlogHelm"
  - branch specification `+:refs/heads/*`
  - authentication method: Uploaded key ("ENVY")
- enable Versioned Settings
  - Synchronization Enabled
  - Project settings VCS root: "Blog Helm"
  - Use Settings from VCS
  - Store secure values outside of VCS
  - Settings format: Kotlin
  - at the prompt, select "Import settings from VCS"

Set an environment variable on the root project named `KUBECTL_CONFIG` which
will contain the base64 encoded contents of your kube config. You can create
that value with `kubectl config view --flatten | base64 -w 0`

### DNS

The following commands will allow minikube (and Docker Toolbox if you use it) to
use whatever dummy hosts you add in your `C:\Windows\System32\drivers\etc\hosts`
file.

    # for Docker Toolbox
    C:\Program Files\Oracle\VirtualBox> .\VBoxManage.exe modifyvm default --natdnshostresolver1 on
    # for minikube
    C:\Program Files\Oracle\VirtualBox> .\VBoxManage.exe modifyvm minikube --natdnshostresolver1 on

Reference: https://www.virtualbox.org/manual/ch09.html#nat-adv-dns

Add the following entries to your hosts file:

    # minikube
    192.168.99.101 test.blog-helm.local
    192.168.99.101 acc.blog-helm.local
    192.168.99.101 blog-helm.local

The IP needs to match minikube's IP, which you can get with `minikube ip`.

## Setting up Jenkins

TODO
