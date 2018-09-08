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
end
