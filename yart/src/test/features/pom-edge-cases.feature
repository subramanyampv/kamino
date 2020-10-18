Feature: pom.xml edge cases

  Edge cases regarding pom.xml

  Background: a git repo
    Given a git repo

  Scenario: it should fail if no -v argument is given
    Given the file 'simple/pom.xml' with version '0.9.2' is committed
    When running without version argument
    Then it should fail with message 'Version 0.9.2 is not allowed. Use one of 0.0.0, 0.0.1, 0.1.0, 1.0.0.'

  Scenario: it should not accept a pom.xml without version
    Given the file 'simple/pom-no-version.xml' is committed as 'pom.xml'
    When running with version argument 'major'
    Then it should fail with message 'Could not determine version of pom.xml'

  Scenario: it should not accept a pom.xml that is not semver
    Given the file 'simple/pom-not-semver.xml' is committed as 'pom.xml'
    When running with version argument 'major'
    Then it should fail with message 'Version 1.0 defined in pom.xml is not SemVer'
