# blog-helm
An example hello world application to show Docker and Helm

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

Run the CI Docker image with:

```
docker run -v $(pwd)/test-reports:/app/test-reports blog-ci npm run lint
```
