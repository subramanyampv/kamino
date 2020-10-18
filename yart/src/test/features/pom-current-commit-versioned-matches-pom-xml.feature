Feature: current commit is versioned and matches pom.xml

  The current commit is versioned as 0.0.1 and that is also the version defined in pom.xml.

  Background: a git repo with a pom.xml comitted and tagged
    Given a git repo
    Given the file 'simple/pom.xml' with version '0.0.1' is committed
    Given the commit is tagged with '0.0.1'

  Scenario: it should fail when run without version argument
    When running without version argument
    Then it should fail with message 'Version 0.0.1 is not allowed. Use one of 0.0.2, 0.1.0, 1.0.0.'

  Scenario Outline: the current commit is versioned and matches pom.xml
    When running with version argument '<versionArgument>'
    Then the latest git version should be '<expectedVersion>'
    And it should succeed
    And it should add a new commit
    And the pom.xml version should be '<expectedVersion>'

    Examples:
      | versionArgument | expectedVersion |
      | patch           | 0.0.2           |
      | minor           | 0.1.0           |
      | major           | 1.0.0           |
      | 0.0.2           | 0.0.2           |
      | 0.1.0           | 0.1.0           |
      | 1.0.0           | 1.0.0           |

  Scenario Outline: the current commit is versioned and matches pom.xml, on develop branch
    Given a new branch named 'develop' is checked out
    When running with version argument '<versionArgument>'
    Then the latest git version should be '0.0.1'
    And it should succeed
    And it should add a new commit
    And the pom.xml version should be '<expectedVersion>'

    Examples:
      | versionArgument | expectedVersion |
      | patch           | 0.0.2           |
      | minor           | 0.1.0           |
      | major           | 1.0.0           |
      | 0.0.2           | 0.0.2           |
      | 0.1.0           | 0.1.0           |
      | 1.0.0           | 1.0.0           |

  Scenario Outline: the current commit is versioned and matches pom.xml, invalid versionArgument
    When running with version argument '<versionArgument>'
    Then it should fail with message 'Version <versionArgument> is not allowed. Use one of 0.0.2, 0.1.0, 1.0.0.'

    Examples:
      | versionArgument |
      | 0.0.0           |
      | 0.0.1           |
      | 0.0.3           |
      | 0.2.4           |
      | 0.3.0           |
      | 2.0.0           |

  Scenario Outline: the current commit is versioned and matches pom.xml, dry run mode
    When running with version argument '<versionArgument>' in dry run
    Then the latest git version should be '0.0.1'
    And it should succeed
    And it should not add a new commit
    And the pom.xml version should be '0.0.1'

    Examples:
      | versionArgument |
      | patch           |
      | minor           |
      | major           |
      | 0.0.2           |
      | 0.1.0           |
      | 1.0.0           |
