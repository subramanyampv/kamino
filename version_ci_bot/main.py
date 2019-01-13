import argparse
import os
import version_ci_bot.pom
import version_ci_bot.bitbucket_cloud
import version_ci_bot.bitbucket_pipelines


def is_ci():
  try:
    return os.environ['CI']
  except KeyError:
    return False


def ensure_tag_does_not_exist(cwd='.'):
  '''
  Ensures that the version specified in the project file does not already
  exist as a git tag.

  Supported project files are pom.xml, package.json, setup.py.

  Additionally, it ensures that the project version does not leave gaps
  in the SemVer sequence.
  '''

  if not is_ci():
    raise ValueError('Should only run in CI environments')

  pom_xml_path = os.path.join(cwd, 'pom.xml')
  if not os.path.isfile(pom_xml_path):
    raise ValueError(f'pom.xml not found in directory {cwd}')

  pom_version = version_ci_bot.pom.read_version(pom_xml_path)

  bitbucket_cloud = version_ci_bot.bitbucket_cloud.BitbucketCloud()
  bitbucket_cloud.owner = version_ci_bot.bitbucket_pipelines.repo_owner()
  bitbucket_cloud.slug = version_ci_bot.bitbucket_pipelines.repo_slug()
  bitbucket_cloud.username = os.environ['BITBUCKET_USERNAME']
  bitbucket_cloud.password = os.environ['BITBUCKET_PASSWORD']

  if bitbucket_cloud.tag_exists(f'v{pom_version}'):
    raise ValueError(
        f'Version {pom_version} is already tagged. Please bump the version in pom.xml')

  # TODO: check for semver gap
  # TODO: multimodule pom sanity check of child versions
  # TODO: package.json, setup.py
  # TODO: github


def publish_tag():
  '''
  Creates a new tag based on the version specified in the project file.
  '''
  pass


def main():
  parser = argparse.ArgumentParser(description='version-ci-bot')
  parser.add_argument('--ensure-tag-does-not-exist',
                      help='Ensure that the version defined in the project files does not exist already as a git tag', action='store_true')
  parser.add_argument('--cwd', default='.',
                      help='The directory of the project files')
  cli_args = parser.parse_args()
  if cli_args.ensure_tag_does_not_exist:
    ensure_tag_does_not_exist(cwd=cli_args.cwd)
  else:
    print('nothing to do')


if __name__ == "__main__":
  main()
