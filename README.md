# instarepo
CLI automation tool to create repositories and activate their build pipeline

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
