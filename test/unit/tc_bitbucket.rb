require_relative '../../bitbucket'
require_relative '../../rest_client'
require_relative '../../repo_options'
require_relative '../../server_options'

require 'test/unit'
require 'mocha/test_unit'

# Unit tests for Bitbucket.
class TestBitbucket < Test::Unit::TestCase
  # rubocop:disable Metrics/MethodLength
  def setup
    repo_options = RepoOptions.new
    repo_options.name = 'instarepo'
    repo_options.owner = 'ngeor'
    repo_options.description = 'My brand new repo'
    server_options = ServerOptions.new
    server_options.username = 'user'
    server_options.password = 'password'

    @bitbucket = Bitbucket.new(
      repo_options,
      server_options
    )
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def test_create_repo
    # arrange
    url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
    expected_body = {
      scm: 'git',
      is_private: true,
      description: 'My brand new repo',
      language: 'java',
      fork_policy: 'no_forks',
      mainbranch: {
        type: 'branch',
        name: 'master'
      }
    }

    expected_basic_auth = BasicAuth.new('user', 'password')
    RestClient.any_instance.expects(:post)
              .with(url, expected_body, basic_auth: expected_basic_auth)
              .returns(test: 42)

    # act
    repo = @bitbucket.create_repo

    # assert
    assert_equal({ test: 42 }, repo)
  end
  # rubocop:enable Metrics/MethodLength

  def test_delete_repo
    url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
    expected_basic_auth = BasicAuth.new('user', 'password')
    RestClient.any_instance.expects(:delete)
              .with(url, basic_auth: expected_basic_auth)
              .returns(nil)
    assert_nil(@bitbucket.delete_repo)
  end

  def test_repo_exists_true
    url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
    expected_basic_auth = BasicAuth.new('user', 'password')
    RestClient.any_instance.expects(:get)
              .with(url, basic_auth: expected_basic_auth)
              .returns(name: 'instarepo')
    assert_true(@bitbucket.repo_exists?)
  end

  def test_repo_exists_false
    url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
    expected_basic_auth = BasicAuth.new('user', 'password')
    RestClient.any_instance.expects(:get)
              .with(url, basic_auth: expected_basic_auth)
              .raises(RestClientError.new('404', 'oops', 'not found'))
    assert_false(@bitbucket.repo_exists?)
  end

  def test_repo_exists_forbidden
    url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
    expected_basic_auth = BasicAuth.new('user', 'password')
    RestClient.any_instance.expects(:get)
              .with(url, basic_auth: expected_basic_auth)
              .raises(RestClientError.new('403', 'oops', 'not found'))
    assert_raise RestClientError do
      @bitbucket.repo_exists?
    end
  end
end
