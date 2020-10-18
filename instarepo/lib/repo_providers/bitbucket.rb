# frozen_string_literal: true

require "json"
require "net/http"
require_relative "../basic_auth"
require_relative "../repo"
require_relative "../rest_client"

module RepoProviders
  # Bitbucket Cloud repository provider.
  class Bitbucket
    def initialize
      @rest_client = RestClient.new
    end

    include BasicAuthMixin
    include RepoMixin

    # rubocop:disable Metrics/MethodLength
    def create_repo(options)
      # https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D#post
      body = {
        scm: "git",
        is_private: true,
        description: options[:description],
        language: options[:language],
        fork_policy: "no_forks",
        mainbranch: {
          type: "branch",
          name: "master"
        }
      }
      @rest_client.post(repo_url, body, basic_auth: basic_auth)
    end
    # rubocop:enable Metrics/MethodLength

    def delete_repo
      @rest_client.delete(repo_url, basic_auth: basic_auth)
    end

    def repo_exist?
      @rest_client.get(repo_url, basic_auth: basic_auth)
      true
    rescue RestClientError => e
      raise e unless e.code.to_s == "404"

      false
    end

    def clone_url(use_ssh: true)
      if use_ssh
        "git@bitbucket.org:#{slug}.git"
      else
        "https://#{username}@bitbucket.org/#{slug}.git"
      end
    end

    # Activates Bitbucket Pipelines for the repo
    def activate_repo
      body = {
        enabled: true
      }
      url = repo_url + "/pipelines_config"
      @rest_client.put(url, body, basic_auth: basic_auth)
    end

    # Deactivates Bitbucket Pipelines for the repo
    def deactivate_repo
      body = {
        enabled: false
      }
      url = repo_url + "/pipelines_config"
      @rest_client.put(url, body, basic_auth: basic_auth)
    end

    private

    def base_url
      "https://api.bitbucket.org/2.0"
    end

    def repo_url
      "#{base_url}/repositories/#{slug}"
    end

    def basic_auth
      BasicAuth.new(username, password)
    end
  end
end
