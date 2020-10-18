# frozen_string_literal: true

require "json"
require "net/http"
require_relative "../basic_auth"
require_relative "../repo"
require_relative "../rest_client"

module RepoProviders
  # Handles the response of getting repositories
  class ReposResponseHandler
    def self.handle_response(res)
      case res
      when Net::HTTPSuccess
        repositories = JSON.parse(res.body)
        # <https://api.github.com/user/461097/repos?page=2>; rel="next", <https://api.github.com/user/461097/repos?page=4>; rel="last"
        # @type [String]
        link = res.header[:link]
        # @type [String]
        next_link = link.split(",")
                        .map(&:strip)
                        .select { |p| p.end_with?("rel=\"next\"") }
                        .first
        next_link = next_link.slice(1, next_link.index(">") - 1) if next_link
        [repositories, next_link]
      else
        raise RestClientError.new(res.code, res.message, res.body)
      end
    end
  end

  # GitHub repository provider.
  class GitHub
    def initialize
      @rest_client = RestClient.new
    end

    include BasicAuthMixin
    include RepoMixin

    def get_repos_next_page(url)
      @rest_client.get(
        url,
        basic_auth: basic_auth,
        headers: { "Accept" => "application/vnd.github.v3+json" },
        response_handler: ReposResponseHandler
      )
    end

    def get_repos_first_page(username)
      url = "#{base_url}/users/#{username}/repos"
      get_repos_next_page(url)
    end

    def repos(username)
      result = []
      repositories, next_link = get_repos_first_page(username)
      result += repositories
      while next_link
        repositories, next_link = get_repos_next_page(next_link)
        result += repositories
      end

      repositories
    end

    def repo_exist?
      url = "#{base_url}/repos/#{slug}"
      @rest_client.get(url, basic_auth: basic_auth)
      true
    rescue RestClientError => e
      raise e unless e.code.to_s == "404"

      false
    end

    def create_repo(options)
      url = "#{base_url}/user/repos"
      body = {
        name: name,
        description: options[:description],
        auto_init: true,
        gitignore_template: gitignore_template(options),
        license_template: "mit"
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

    def get_pull_requests(username, repo_name)
      url = "#{base_url}/repos/#{username}/#{repo_name}/pulls"
      @rest_client.get(url, basic_auth: basic_auth)
    end

    def create_pr(username, repo_name, branch_name, title)
      url = "#{base_url}/repos/#{username}/#{repo_name}/pulls"
      body = {
        title: title,
        head: branch_name,
        base: "master"
      }
      @rest_client.post(url, body, basic_auth: basic_auth)
    end

    # Merges a PR.
    # @param pr_url [String] The canonical URL of a pull request
    def merge_pr(pr_url)
      @rest_client.put("#{pr_url}/merge", basic_auth: basic_auth)
    end

    def get_any(url)
      @rest_client.get(url, basic_auth: basic_auth)
    end

    private

    def basic_auth
      BasicAuth.new(username, password)
    end

    def base_url
      "https://api.github.com"
    end

    def gitignore_template(options)
      language = options[:language]
      if language == "python"
        "Python"
      else
        "Maven"
      end
    end
  end
end
