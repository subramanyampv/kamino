# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/github'
require_relative '../../../main/ruby/rest_client'

RSpec.describe RepoProviders::GitHub do
  before(:example) do
    @rest_client = double('rest_client')
    expect(RestClient).to receive(:new).and_return(@rest_client)
    @github = RepoProviders::GitHub.new
    @github.name = 'instarepo'
    @github.owner = 'ngeor'
    @github.username = 'user'
    @github.password = 'password'
  end

  describe('#repos') do
    it('should get all repos') do
      # arrange
      url = 'https://api.github.com/user/repos'

      allow(@rest_client).to receive(:get)
        .with(url, basic_auth: BasicAuth.new('user', 'password'))
        .and_return(test: 42)

      # act
      repos = @github.repos

      # assert
      expect(repos).to eq(test: 42)
    end
  end

  describe('#create_repo') do
    it('should create a new repo') do
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
      allow(@rest_client).to receive(:post)
        .with(url, expected_body, basic_auth: expected_basic_auth)
        .and_return(test: 42)

      # act
      repo = @github.create_repo(description: 'My brand new repo')

      # assert
      expect(repo).to eq(test: 42)
    end
  end

  describe('#clone_url') do
    it('should use ssh by default') do
      url = @github.clone_url
      expect(url).to eq('git@github.com:ngeor/instarepo.git')
    end

    it('should use ssh explicitly') do
      url = @github.clone_url(use_ssh: true)
      expect(url).to eq('git@github.com:ngeor/instarepo.git')
    end

    it('should support https') do
      url = @github.clone_url(use_ssh: false)
      expect(url).to eq('https://github.com/ngeor/instarepo.git')
    end
  end

  describe('#repo_exists') do
    it('should return true when the repo exists') do
      url = 'https://api.github.com/repos/ngeor/instarepo'
      allow(@rest_client).to receive(:get)
        .with(url, basic_auth: BasicAuth.new('user', 'password'))
        .and_return(test: 42)
      expect(@github.repo_exist?).to be true
    end

    it('should return false when the repo does not exist') do
      url = 'https://api.github.com/repos/ngeor/instarepo'
      allow(@rest_client).to receive(:get)
        .with(url, basic_auth: BasicAuth.new('user', 'password'))
        .and_raise(RestClientError.new('404', 'oops', 'An error'))
      expect(@github.repo_exist?).to be false
    end

    it('should throw an error when the repo is forbidden') do
      url = 'https://api.github.com/repos/ngeor/instarepo'
      allow(@rest_client).to receive(:get)
        .with(url, basic_auth: BasicAuth.new('user', 'password'))
        .and_raise(RestClientError.new('403', 'oops', 'An error'))
      expect { @github.repo_exist? }.to raise_error(RestClientError)
    end
  end
end
