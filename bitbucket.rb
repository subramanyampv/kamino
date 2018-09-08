require 'json'
require 'net/http'
require_relative './repo_provider_base'
require_relative './rest_client'

# Bitbucket Cloud repository provider.
class Bitbucket < RepoProviderBase
  # rubocop:disable Metrics/MethodLength
  def create_repo
    # https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D#post
    url = "#{base_url}/repositories/#{repo_options.owner}/#{repo_options.name}"
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
    rest_client.post(url, body, basic_auth: basic_auth)
  end
  # rubocop:enable Metrics/MethodLength

  def delete_repo
    url = "#{base_url}/repositories/#{repo_options.owner}/#{repo_options.name}"
    rest_client.delete(url, basic_auth: basic_auth)
  end

  private

  def base_url
    'https://api.bitbucket.org/2.0'
  end
end
