require 'json'
require 'net/http'
require_relative './repo_provider_base'
require_relative './rest_client'

class Bitbucket < RepoProviderBase
  def create_repo
    # https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D#post
    url = "https://api.bitbucket.org/2.0/repositories/#{repo_options.owner}/#{repo_options.name}"
    rest_client = RestClient.new
    rest_client.post(url, {
      scm: 'git',
      is_private: true,
      description: repo_options.description,
      language: 'java',
      fork_policy: 'no_forks',
      mainbranch: {
        type: 'branch',
        name: 'master'
      }
    }, basic_auth: basic_auth)
  end

  def delete_repo
    url = "https://api.bitbucket.org/2.0/repositories/#{repo_options.owner}/#{repo_options.name}"
    rest_client = RestClient.new
    rest_client.delete(url, basic_auth: basic_auth)
  end

  private

  def basic_auth
    BasicAuth.new(username, password)
  end

  def username
    server_options.username
  end

  def password
    server_options.password
  end
end
