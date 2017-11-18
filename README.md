# blog-helm
An example hello world application to show Docker and Helm

## Standalone usage

Install the dependencies with:

```
npm install
```

Run the app with:

```
node index.js
```

Lint the app with:

```
npm run lint
```

## Docker usage

Build the production Docker image with:

```
docker build -t blog .
```

Run the app with:

```
docker run -p 3000:3000 blog
```

Build the CI Docker image with:

```
docker build -t blog-ci -f Dockerfile-ci .
```

Use the CI Docker image to lint the app with:

```
docker run -v $(pwd)/test-reports:/app/test-reports blog-ci npm run lint
```

For the XML report:

```
docker run -v $(pwd)/test-reports:/app/test-reports blog-ci npm run lint-junit
```

Correct user permissions if needed with:

```
docker run -v $(pwd)/test-reports:/app/test-reports blog-ci chown -R $(id -u):$(id -g) test-reports
```
