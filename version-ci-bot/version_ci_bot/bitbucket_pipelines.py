import os


def commit():
    '''
    The commit hash of a commit that kicked off the build.
    '''
    return os.environ['BITBUCKET_COMMIT']


def repo_owner():
    '''
    The name of the account in which the repository lives.
    '''
    return os.environ['BITBUCKET_REPO_OWNER']


def repo_slug():
    '''
    The URL-friendly version of a repository name.
    '''
    return os.environ['BITBUCKET_REPO_SLUG']


def branch():
    '''
    The source branch. This value is only available on branches.

    Not available for builds against tags, or custom pipelines.
    '''
    return os.environ['BITBUCKET_BRANCH']
