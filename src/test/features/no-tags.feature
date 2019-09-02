Feature: No tags

  In this feature, all changes are committed and no git tags exist.

  Background:
    Given a git repo
    Given a text file
    Given the file is staged
    Given changes are committed

  Scenario Outline: When there are no existing git versions (happy flow)
    When running with version argument '<versionArgument>'
    Then it should succeed
    Then the latest git version should be '<expectedVersion>'
    Then it should not add a new commit

    Examples:
      | versionArgument | expectedVersion |
      | patch           | 0.0.1           |
      | minor           | 0.1.0           |
      | major           | 1.0.0           |
      | 0.0.0           | 0.0.0           |
      | 0.0.1           | 0.0.1           |
      | 0.1.0           | 0.1.0           |
      | 1.0.0           | 1.0.0           |

  Scenario Outline: When there are no existing git versions (semver gap flow)
    When running with version argument '<versionArgument>'
    Then it should fail with message 'Version <versionArgument> is not allowed. Use one of 0.0.0, 0.0.1, 0.1.0, 1.0.0.'
    Then it should not add a new commit

    Examples:
      | versionArgument |
      | 0.0.2           |
      | 0.2.0           |
      | 2.0.0           |

  Scenario Outline: When there are no existing git versions (invalid version flow)
    When running with version argument '<versionArgument>'
    Then it should fail with message 'Unsupported next version: <versionArgument>'
    Then it should not add a new commit

    Examples:
      | versionArgument |
      | oops            |
      | 0               |
      | 0.1             |
      | 1.0             |
      | 1.2.3.4         |

  Scenario: When there are no existing git versions (missing version argument)
    When running without version argument
    Then it should fail with message 'Please specify the version with -v'

  Scenario: When the current git version is not semver
    Given the commit is tagged with '1.0'
    When running with version argument 'patch'
    Then it should fail with message 'Current git version 1.0 is not SemVer'

  Scenario: When the current commit is already versioned
    Given the commit is tagged with '1.0.0'
    When running with version argument 'patch'
    Then it should fail with message 'The current commit is already tagged with version 1.0.0'
