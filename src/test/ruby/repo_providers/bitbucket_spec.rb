# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/bitbucket'
require_relative '../../../main/ruby/rest_client'

RSpec.describe RepoProviders::Bitbucket do
  before(:example) do
    @rest_client = double('rest_client')
    expect(RestClient).to receive(:new).and_return(@rest_client)
    @bitbucket = RepoProviders::Bitbucket.new
    @bitbucket.name = 'instarepo'
    @bitbucket.owner = 'ngeor'
    @bitbucket.username = 'user'
    @bitbucket.password = 'password'
  end

  describe '#create_repo' do
    it 'should create the repo' do
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
      allow(@rest_client).to receive(:post)
        .with(url, expected_body, basic_auth: expected_basic_auth)
        .and_return(test: 42)

      # act
      repo = @bitbucket.create_repo(description: 'My brand new repo')

      # assert
      expect(repo).to eq(test: 42)
    end
  end

  describe '#delete_repo' do
    it 'should delete the repo' do
      url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
      expected_basic_auth = BasicAuth.new('user', 'password')
      allow(@rest_client).to receive(:delete)
        .with(url, basic_auth: expected_basic_auth)
        .and_return(nil)
      expect(@bitbucket.delete_repo).to be_nil
    end
  end

  describe '#repo_exists?' do
    it 'should return true when repo exists' do
      url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
      expected_basic_auth = BasicAuth.new('user', 'password')
      allow(@rest_client).to receive(:get)
        .with(url, basic_auth: expected_basic_auth)
        .and_return(name: 'instarepo')
      expect(@bitbucket.repo_exists?).to be true
    end

    it 'should return false when repo does not exist' do
      url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
      expected_basic_auth = BasicAuth.new('user', 'password')
      allow(@rest_client).to receive(:get)
        .with(url, basic_auth: expected_basic_auth)
        .and_raise(RestClientError.new('404', 'oops', 'not found'))
      expect(@bitbucket.repo_exists?).to be false
    end

    it 'should raise an exception when repo is forbidden' do
      url = 'https://api.bitbucket.org/2.0/repositories/ngeor/instarepo'
      expected_basic_auth = BasicAuth.new('user', 'password')
      allow(@rest_client).to receive(:get)
        .with(url, basic_auth: expected_basic_auth)
        .and_raise(RestClientError.new('403', 'oops', 'not found'))
      expect { @bitbucket.repo_exists? }.to raise_error(RestClientError)
    end
  end

  describe '#clone_url' do
    it 'should use ssh by default' do
      expect(@bitbucket.clone_url).to eq(
        'git@bitbucket.org:ngeor/instarepo.git'
      )
    end

    it 'should use ssh explicitly' do
      expect(@bitbucket.clone_url(use_ssh: true)).to eq(
        'git@bitbucket.org:ngeor/instarepo.git'
      )
    end

    it 'should support https' do
      expect(@bitbucket.clone_url(use_ssh: false)).to eq(
        'https://user@bitbucket.org/ngeor/instarepo.git'
      )
    end
  end
end
