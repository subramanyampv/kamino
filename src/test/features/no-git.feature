Feature: No git

    When the command is not run in a git repository it should fail

  Scenario: When there is no git repository
    Given a temporary directory
    When running with version argument 'patch'
    Then it should fail with message 'Not a git repository'
