# instarepo
CLI automation tool to create repositories and activate their build pipeline

[![Build Status](https://travis-ci.org/ngeor/instarepo.svg?branch=master)](https://travis-ci.org/ngeor/instarepo)

## Usage

    ruby main.rb [OPTIONS]

The following options are available:

- `--provider` chooses the git repository provider. Supported
  values are `bitbucket` and `github`.
- `--username` and `--password` provide the credentials to
  access the REST API of Bitbucket Cloud or GitHub.
- `--owner` is the owner of the repository. Might be the same
  as username for user who don't belong to an organization.
- `--name` is the name of the repository. Together with the `owner`
  they form the slug of the repository, i.e. `owner/name`.
- `--description` provides a short description for the repository.
- `--clone-dir` the local directory in which the repository should
  be cloned. If you specify `C:\Projects` and the name of the
  repository is `my-project`, then the repository will end up
  being cloned in `C:\Projects\my-project`.
- `--language` sets the programming language of the repository.
  Currently the only valid value is `java`.

## Examples

### Create new repository on GitHub

To create a new repository on GitHub:

    ruby main.rb create --provider github --username secret \
    --password secret --owner ngeor --name instarepo \
    --description "A cool new project"

The repository will be _public_ and it will be automatically initialized by
GitHub with a README file, a `.gitignore` file (currently only for Maven)
and a `LICENSE` file (currently only MIT license).

### Create new repository on Bitbucket Cloud

To create a new repository on Bitbucket Cloud:

    ruby main.rb create --provider bitbucket --username secret \
    --password secret --owner ngeor --name instarepo \
    --language java \
    --description "A cool new project"

The repository will be _private_ and it will be empty. It will have a no fork
policy.

## Roadmap

- Support GitHub with Travis
- Support Bitbucket Cloud with Bitbucket Pipelines
- Support Java/maven initially

### Travis

Travis token is set via environment variable `TRAVIS_TOKEN`. To obtain the token,
you need to run `travis login` and `travis token`. You can read more here:

https://developer.travis-ci.com/authentication

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
