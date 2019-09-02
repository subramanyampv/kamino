Feature: Pending changes

    When the git repo has pending changes it should fail.

  Scenario: When there are pending changes
    Given a git repo
    Given a text file
    Given the file is staged
    When running with version argument 'patch'
    Then it should fail with message 'There are pending changes. Please commit or stash them first.'
