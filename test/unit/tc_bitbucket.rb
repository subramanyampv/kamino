require_relative '../../bitbucket'
require_relative '../../rest_client'
require_relative '../../repo_options'
require_relative '../../server_options'

require 'test/unit'
require 'mocha/test_unit'

class TestBitbucket < Test::Unit::TestCase
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

  def test_create_repo
    # arrange
    url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'

    RestClient.any_instance.expects(:post).with(url, {
      scm: 'git',
      is_private: true,
      description: 'My brand new repo',
      language: 'java',
      fork_policy: 'no_forks',
      mainbranch: {
        type: 'branch',
        name: 'master'
      }
    }, basic_auth: BasicAuth.new('user', 'password')).returns({
      test: 42
    })

    # act
    repo = @bitbucket.create_repo

    # assert
    assert_equal({ test: 42 }, repo)
  end

end
