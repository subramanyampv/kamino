# frozen_string_literal: true

require 'json'
require 'net/http'
require_relative '../basic_auth'
require_relative '../repo'
require_relative '../rest_client'

module RepoProviders
  # GitHub repository provider.
  class GitHub
    def initialize
      @rest_client = RestClient.new
    end

    include BasicAuthMixin
    include RepoMixin

    def repos
      # curl -u username:password 'https://api.github.com/user/repos'
      # if 2FA is on, password needs to replaced by personal access token
      url = "#{base_url}/user/repos"
      @rest_client.get(url, basic_auth: basic_auth)
    end

    def repo_exist?
      url = "#{base_url}/repos/#{slug}"
      @rest_client.get(url, basic_auth: basic_auth)
      true
    rescue RestClientError => e
      raise e unless e.code.to_s == '404'
      false
    end

    def create_repo(options)
      url = "#{base_url}/user/repos"
      body = {
        name: name,
        description: options[:description],
        auto_init: true,
        gitignore_template: gitignore_template(options),
        license_template: 'mit'
      }
      @rest_client.post(url, body, basic_auth: basic_auth)
    end

    def delete_repo
      # https://developer.github.com/v3/repos/#delete-a-repository
      url = "#{base_url}/repos/#{slug}"
      @rest_client.delete(url, basic_auth: basic_auth)
    end

    def clone_url(use_ssh: true)
      if use_ssh
        "git@github.com:#{slug}.git"
      else
        "https://github.com/#{slug}.git"
      end
    end

    private

    def basic_auth
      BasicAuth.new(username, password)
    end

    def base_url
      'https://api.github.com'
    end

    def gitignore_template(options)
      language = options[:language]
      if language == 'python'
        'Python'
      else
        'Maven'
      end
    end
  end
end
