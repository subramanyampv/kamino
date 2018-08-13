# blog-helm
An example hello world application to show Docker and Helm

## Standalone usage

| Command         | Action               |
|-----------------|----------------------|
| `npm i`         | Install dependencies |
| `node index.js` | Run the application  |
| `npm run lint`  | Lint the app         |

## Docker usage

Build the production Docker image with:

```
docker build -t blog-helm .
```

Run the app with:

```
docker run -p 3000:3000 blog-helm
```

Build the CI Docker image with:

```
docker build -t blog-helm-ci -f Dockerfile-ci .
```

Use the CI Docker image to lint the app with:

```
docker run --rm -v $(pwd)/test-reports:/app/test-reports blog-helm-ci npm run lint
```

For the XML report:

```
docker run --rm -v $(pwd)/test-reports:/app/test-reports blog-helm-ci npm run lint-junit
```

Correct user permissions if needed with:

```
docker run --rm -v $(pwd)/test-reports:/app/test-reports blog-helm-ci chown -R $(id -u):$(id -g) test-reports
```

## WebdriverIO

To run tests against an app that runs on http://localhost:3000/ :

```
npm run wdio
```

To run tests against an app at a different base URL:

```
npm run wdio -- -b http://some.other.url/
```
