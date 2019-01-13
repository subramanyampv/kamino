import os


def is_ci():
  return os.environ['CI']


def ensure_tag_does_not_exist():
  '''
  Ensures that the version specified in the project file does not already
  exist as a git tag.

  Supported project files are pom.xml, package.json, setup.py.

  Additionally, it ensures that the project version does not leave gaps
  in the SemVer sequence.
  '''
  if not is_ci():
    raise ValueError('Should only run in CI environments')



def publish_tag():
  '''
  Creates a new tag based on the version specified in the project file.
  '''
  pass


def main():
  print('version ci bot is under construction')


if __name__ == "__main__":
  main()
