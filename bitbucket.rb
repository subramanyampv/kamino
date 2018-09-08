require 'json'
require 'net/http'
require_relative './repo_provider_base'
require_relative './rest_client'

# Bitbucket Cloud repository provider.
class Bitbucket < RepoProviderBase
  # rubocop:disable Metrics/MethodLength
  def create_repo
    # https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D#post
    body = {
      scm: 'git',
      is_private: true,
      description: repo_options.description,
      language: 'java',
      fork_policy: 'no_forks',
      mainbranch: {
        type: 'branch',
        name: 'master'
      }
    }
    rest_client.post(repo_url, body, basic_auth: basic_auth)
  end
  # rubocop:enable Metrics/MethodLength

  def delete_repo
    rest_client.delete(repo_url, basic_auth: basic_auth)
  end

  def repo_exists?
    rest_client.get(repo_url, basic_auth: basic_auth)
    true
  rescue RestClientError => ex
    raise ex unless ex.code.to_s == '404'
    false
  end

  def clone_url(use_ssh = true)
    if use_ssh
      "git@bitbucket.org:#{repo_options.owner}/#{repo_options.name}.git"
    else
      "https://#{server_options.username}@bitbucket.org/" \
      "#{repo_options.owner}/#{repo_options.name}.git"
    end
  end

  private

  def base_url
    'https://api.bitbucket.org/2.0'
  end

  def repo_url
    "#{base_url}/repositories/#{repo_options.owner}/#{repo_options.name}"
  end
end
