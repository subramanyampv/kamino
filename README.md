# instarepo
CLI automation tool to create repositories and activate their build pipeline

## Configuration

### Github

Username and password are set via environment variables `GITHUB_USERNAME`
and `GITHUB_TOKEN` respectively.

### Travis

Travis token is set via environment variable `TRAVIS_TOKEN`. To obtain the token,
you need to run `travis login` and `travis token`. You can read more here:

https://developer.travis-ci.com/authentication

## Roadmap

- Support GitHub with Travis
- Support Bitbucket Cloud with Bitbucket Pipelines
- Support Java/maven initially

### GitHub with Travis

The following should happen automatically:

- Select license and gitignore file
- Clone repo
- Commit approprivate `travis.yml` file
- Activate repository on Travis
- Push initial commit that should have a green build
- Add travis badge in README

### Bitbucket Cloud with Bitbucket Pipelines

- Similar setup except the badge
