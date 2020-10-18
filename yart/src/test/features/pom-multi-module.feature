Feature: pom.xml multi module cases

  Edge cases regarding multi-module pom.xml

  Background: a git repo
    Given a git repo

  Scenario: it should bump 3.12.0 to 3.13.0
    Given the file 'multi-module/pom.xml' is copied and added
    Given the file 'multi-module/bar-child-module/pom.xml' is copied and added
    Given the file 'multi-module/foo-child-module/pom.xml' is copied and added
    Given changes are committed with message 'initial version'
    Given the commit is tagged with '3.12.0'
    When running with version argument 'minor'
    Then it should succeed
    And the latest git version should be '3.13.0'
    And it should add a new commit
    And it should not have git changes
    And the file 'pom.xml' should have same contents as 'multi-module/pom-expected.xml'
    And the file 'bar-child-module/pom.xml' should have same contents as 'multi-module/bar-child-module/pom-expected.xml'
    And the file 'foo-child-module/pom.xml' should have same contents as 'multi-module/foo-child-module/pom-expected.xml'
