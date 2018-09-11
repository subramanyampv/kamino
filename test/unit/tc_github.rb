require_relative '../../github'
require_relative '../../rest_client'

require 'test/unit'
require 'mocha/test_unit'

# Unit tests for GitHub.
class TestGitHub < Test::Unit::TestCase
  def setup
    options = {
      name: 'instarepo',
      owner: 'ngeor',
      description: 'My brand new repo',
      username: 'user',
      password: 'password'
    }

    @github = GitHub.new(options)
  end

  def test_repos
    # arrange
    url = 'https://api.github.com/user/repos'

    RestClient.any_instance.expects(:get)
              .with(url, basic_auth: BasicAuth.new('user', 'password'))
              .returns(test: 42)

    # act
    repos = @github.repos

    # assert
    assert_equal({ test: 42 }, repos)
  end

  # rubocop:disable Metrics/MethodLength
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

    expected_basic_auth = BasicAuth.new('user', 'password')
    RestClient.any_instance.expects(:post)
              .with(url, expected_body, basic_auth: expected_basic_auth)
              .returns(test: 42)

    # act
    repo = @github.create_repo

    # assert
    assert_equal({ test: 42 }, repo)
  end
  # rubocop:enable Metrics/MethodLength

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

  def test_repo_exists_true
    url = 'https://api.github.com/repos/ngeor/instarepo'
    RestClient.any_instance.expects(:get)
              .with(url, basic_auth: BasicAuth.new('user', 'password'))
              .returns(test: 42)
    assert_true(@github.repo_exists?)
  end

  def test_repo_exists_false
    url = 'https://api.github.com/repos/ngeor/instarepo'
    RestClient.any_instance.expects(:get)
              .with(url, basic_auth: BasicAuth.new('user', 'password'))
              .raises(RestClientError.new('404', 'oops', 'An error'))
    assert_false(@github.repo_exists?)
  end

  def test_repo_exists_forbidden
    url = 'https://api.github.com/repos/ngeor/instarepo'
    RestClient.any_instance.expects(:get)
              .with(url, basic_auth: BasicAuth.new('user', 'password'))
              .raises(RestClientError.new('403', 'oops', 'An error'))
    assert_raise RestClientError do
      @github.repo_exists?
    end
  end
end
