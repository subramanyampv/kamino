require_relative '../../repo_options'

require 'test/unit'

class TestRepoOptions < Test::Unit::TestCase
  def test_create
    repo_options = RepoOptions.new
    assert_nil(repo_options.name)
    assert_nil(repo_options.owner)
    assert_nil(repo_options.description)
    assert_nil(repo_options.language)
    assert_equal("RepoOptions {name: , owner: , language: , description: }", repo_options.to_s)
  end

  def test_with_properties
    repo_options = RepoOptions.new
    repo_options.name = 'myrepo'
    repo_options.owner = 'ngeor'
    repo_options.description = 'A new repo'
    repo_options.language = 'Java'

    assert_equal('myrepo', repo_options.name)
    assert_equal('ngeor', repo_options.owner)
    assert_equal('A new repo', repo_options.description)
    assert_equal('Java', repo_options.language)
    assert_equal('RepoOptions {name: myrepo, owner: ngeor, language: Java, description: A new repo}', repo_options.to_s)
  end
end
