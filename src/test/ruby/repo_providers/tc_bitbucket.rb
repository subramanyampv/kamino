# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/bitbucket'
require_relative '../../../main/ruby/rest_client'

require 'test/unit'
require 'mocha/test_unit'

module RepoProviders
  # Unit tests for Bitbucket.
  class TestBitbucket < Test::Unit::TestCase
    def setup
      options = {
        name: 'instarepo',
        owner: 'ngeor',
        description: 'My brand new repo',
        username: 'user',
        password: 'password'
      }
      @bitbucket = Bitbucket.new(options)
    end

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

    def test_clone_url
      assert_equal(
        'git@bitbucket.org:ngeor/instarepo.git',
        @bitbucket.clone_url
      )
    end

    def test_clone_url_use_ssh_true
      assert_equal(
        'git@bitbucket.org:ngeor/instarepo.git',
        @bitbucket.clone_url(true)
      )
    end

    def test_clone_url_use_ssh_false
      assert_equal(
        'https://user@bitbucket.org/ngeor/instarepo.git',
        @bitbucket.clone_url(false)
      )
    end
  end
end
