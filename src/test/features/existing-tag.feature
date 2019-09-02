Feature: Existing git tag

  In this feature, all changes are committed and a git tag exists.

  Background:
    Given a git repo
    Given a text file
    Given the file is staged
    Given changes are committed
    Given the commit is tagged with '1.0.0'
    Given a text file with contents 'hello world once again'
    Given the file is staged
    Given changes are committed with message 'Modifying file'

  Scenario Outline: When a git version exists (happy flow)
    When running with version argument '<versionArgument>'
    Then it should succeed
    Then the latest git version should be '<expectedVersion>'
    But it should not add a new commit

    Examples:
      | versionArgument | expectedVersion |
      | patch           | 1.0.1           |
      | minor           | 1.1.0           |
      | major           | 2.0.0           |
      | 1.0.1           | 1.0.1           |
      | 1.1.0           | 1.1.0           |
      | 2.0.0           | 2.0.0           |

  Scenario Outline: When a git version exists (semver gap flow)
    When running with version argument '<versionArgument>'
    Then it should fail with message 'Version <versionArgument> is not allowed. Use one of 1.0.1, 1.1.0, 2.0.0.'
    But it should not add a new commit

    Examples:
      | versionArgument |
      | 0.0.0           |
      | 0.0.2           |
      | 0.2.0           |
      | 1.0.0           |
      | 1.0.2           |
      | 1.2.0           |
      | 3.0.0           |

  Scenario Outline: When a git version exists (non-semver parameter flow)
    When running with version argument '<versionArgument>'
    Then it should fail with message 'Unsupported next version: <versionArgument>'
    But it should not add a new commit

    Examples:
      | versionArgument |
      | oops            |
      | 2.0             |
      | 1               |
      | 1.2.3.4         |

  Scenario: When a git version exists (missing version argument)
    When running without version argument
    Then it should fail with message 'Please specify the version with -v'

  Scenario: When not on the master branch
    Given a new branch named 'develop' is checked out
    When running with version argument 'minor'
    Then it should fail with message 'Only the master branch can be tagged'
