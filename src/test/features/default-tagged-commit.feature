Feature: default case when the commit is already tagged

  Defines the behavior of running the program against a default project
  where the current commit is already tagged.

  Background: a git repo where the current commit is tagged
    Given a git repo
    Given a text file is committed
    Given the commit is tagged with '0.9.2'

  Scenario: it should fail when run without version argument
    When running without version argument
    Then it should fail with message 'The current commit is already tagged with version 0.9.2'

  Scenario Outline: it should fail when run with version argument
    When running with version argument '<versionArgument>'
    Then it should fail with message 'The current commit is already tagged with version 0.9.2'

    Examples:
      | versionArgument |
      | patch           |
      | minor           |
      | major           |
      | 0.9.3           |
