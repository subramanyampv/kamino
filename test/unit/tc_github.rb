require_relative '../../github'
require_relative '../../rest_client'
require_relative '../../options'

require 'test/unit'
require 'mocha/test_unit'

class TestGitHub < Test::Unit::TestCase
  def setup
    repo_options = RepoOptions.new
    repo_options.name = 'instarepo'
    repo_options.owner = 'ngeor'
    repo_options.description = 'My brand new repo'
    server_options = ServerOptions.new
    server_options.username = 'user'
    server_options.password = 'password'

    @github = GitHub.new(repo_options, server_options)
  end

  def test_get_repos
    # arrange
    url = 'https://api.github.com/user/repos'

    RestClient.any_instance.expects(:get)
      .with(url, basic_auth: BasicAuth.new('user', 'password'))
      .returns({ test: 42})

    # act
    repos = @github.get_repos

    # assert
    assert_equal({ test: 42 }, repos)
  end

  def test_create_repo
    # arrange
    url = 'https://api.github.com/user/repos'

    expected_body = {
      name: 'instarepo',
      description: 'My brand new repo',
      auto_init: true,
      gitignore_template: 'Maven',
      license_template: 'mit'
    }

    RestClient.any_instance.expects(:post)
      .with(url, expected_body, basic_auth: BasicAuth.new('user', 'password'))
      .returns({ test: 42})

    # act
    repo = @github.create_repo

    # assert
    assert_equal({ test: 42 }, repo)
  end

  def test_clone_url
    url = @github.clone_url
    assert_equal('git@github.com:ngeor/instarepo.git', url)
  end

  def test_clone_url_use_ssh_true
    url = @github.clone_url(true)
    assert_equal('git@github.com:ngeor/instarepo.git', url)
  end

  def test_clone_url_use_ssh_false
    url = @github.clone_url(false)
    assert_equal('https://github.com/ngeor/instarepo.git', url)
  end
end
