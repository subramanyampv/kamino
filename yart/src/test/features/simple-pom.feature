Feature: simple pom.xml feature

  Simple pom.xml setups

  Background: a git repo with a pom.xml comitted but not tagged
    Given a git repo
    Given the file 'simple/pom.xml' with version '0.0.1' is committed

  Scenario: it should tag current commit if no -v argument is given
    When running without version argument
    Then it should succeed
    Then the latest git version should be '0.0.1'
    Then it should not add a new commit

  Scenario Outline: it should reject argument not matching pom.xml
    When running with version argument '<versionArgument>'
    Then it should fail with message 'No existing git tags found. Please skip the -v argument to tag the version defined in pom.xml.'
    Examples:
      | versionArgument |
      | 0.0.1           |
      | 0.0.2           |
      | 0.2.0           |
      | patch           |
      | minor           |
      | major           |

  Scenario: the current commit is tagged and it is behind pom.xml
    Given the file 'simple/pom.xml' with version '0.0.2' is committed
    Given the commit is tagged with '0.0.1'
    When running with version argument 'minor'
    Then it should fail with message 'Version cannot be specified when git tag (0.0.1) does not match pom.xml version (0.0.2)'

  Scenario: the current commit is tagged and it is ahead pom.xml
    Given the commit is tagged with '0.0.2'
    When running with version argument 'minor'
    Then it should fail with message 'Version cannot be specified when git tag (0.0.2) does not match pom.xml version (0.0.1)'

  Scenario Outline: current commit is not tagged and last tag matches pom.xml
    Given the commit is tagged with '0.0.1'
    Given a text file is committed
    When running with version argument '<versionArgument>'
    Then it should succeed
    And the latest git version should be '<expectedVersion>'
    And it should add a new commit

    Examples:
      | versionArgument | expectedVersion |
      | patch           | 0.0.2           |
      | minor           | 0.1.0           |
      | major           | 1.0.0           |
      | 0.0.2           | 0.0.2           |
      | 0.1.0           | 0.1.0           |
      | 1.0.0           | 1.0.0           |

  Scenario Outline: current commit is not tagged and last tag matches pom.xml, illegal semver
    Given the commit is tagged with '0.0.1'
    Given a text file is committed
    When running with version argument '<versionArgument>'
    Then it should fail with message 'Version <versionArgument> is not allowed. Use one of 0.0.2, 0.1.0, 1.0.0.'

    Examples:
      | versionArgument |
      | 0.0.0           |
      | 0.0.1           |
      | 0.0.3           |
      | 0.1.1           |
      | 0.2.0           |
      | 1.0.1           |
      | 1.1.0           |
      | 2.0.0           |

  Scenario: current commit is not tagged and last tag matches pom.xml, no version specified
    Given the commit is tagged with '0.0.1'
    Given a text file is committed
    When running without version argument
    Then it should fail with message 'Version 0.0.1 is not allowed. Use one of 0.0.2, 0.1.0, 1.0.0.'

  Scenario: the current commit is not tagged and last tag is behind pom.xml and a valid SemVer transition
    Given the commit is tagged with '0.0.1'
    Given the file 'simple/pom.xml' with version '0.0.2' is committed
    When running without version argument
    Then it should succeed
    And the latest git version should be '0.0.2'
    And it should not add a new commit

  Scenario Outline: the current commit is not tagged and the latest tag is behind pom.xml and a valid SemVer transition with illegal version agument
    Given the commit is tagged with '0.0.1'
    Given the file 'simple/pom.xml' with version '0.0.2' is committed
    When running with version argument '<versionArgument>'
    Then it should fail with message 'Version cannot be specified when git tag (0.0.1) does not match pom.xml version (0.0.2)'
    Examples:
      | versionArgument |
      | 0.0.0           |
      | 0.0.1           |
      | 0.0.2           |
      | 0.0.3           |
      | 0.1.1           |
      | 0.2.0           |
      | 1.0.1           |
      | 1.1.0           |
      | 2.0.0           |
      | major           |
      | minor           |
      | patch           |

  Scenario: the current commit is not tagged and last tag is behind pom.xml and an illegal SemVer transition
    Given the commit is tagged with '0.0.1'
    Given the file 'simple/pom.xml' with version '0.0.3' is committed
    When running with version argument 'minor'
    Then it should fail with message 'Version cannot be specified when git tag (0.0.1) does not match pom.xml version (0.0.3)'

  Scenario: the current commit is not tagged and last tag is ahead of pom.xml
    Given the commit is tagged with '0.0.2'
    When running with version argument 'minor'
    Then it should fail with message 'Version cannot be specified when git tag (0.0.2) does not match pom.xml version (0.0.1)'
