# frozen_string_literal: true

require_relative "../repo_providers/factory"

module Commands
  # Merges open PRs on multiple repositories.
  class MergePullRequestsCommand
    def initialize(options)
      @options = options
      @repo_provider = RepoProviders.create(options)
    end

    def run
      repos = @repo_provider.repos(@options[:owner])
      repos.each do |repo|
        process_repo(repo)
      end
    end

    private

    def can_merge?(pr)
      url = pr["url"]
      state = pr["state"]
      locked = pr["locked"]

      if locked
        puts "Ignoring locked pr #{url}"
        return false
      end

      if state != "open"
        puts "Ignoring pr #{url} in state #{state}"
        return false
      end

      pr_details = @repo_provider.get_any(url)
      merged = pr_details["merged"]
      mergeable = pr_details["mergeable"]
      if merged
        puts "Ignoring already merged pr #{url}"
        return false
      end

      unless mergeable
        puts "Ignoring non-mergeable pr #{url}"
        return false
      end

      links = pr["_links"]
      links_statuses = links["statuses"]
      statuses_href = links_statuses["href"]
      statuses = @repo_provider.get_any(statuses_href).map { |s| s["state"] }
      if statuses.empty?
        if @options[:merge_empty_status]
          return true
        else
          puts "Cannot merge pr because there is no reported status #{url}"
          return false
        end
      end

      if statuses.include?("error")
        puts "Cannot merge pr due to error status #{url}"
        return false
      end
      unless statuses.include?("success")
        puts "Cannot merge pr because no successful statuses exists #{url}"
        return false
      end

      true
    end

    def process_repo(repo)
      puts "Processing repo #{repo['name']}"
      prs = @repo_provider.get_pull_requests(@options[:owner], repo["name"])
      prs.each do |pr|
        @repo_provider.merge_pr(pr["url"]) if can_merge?(pr)
      end
    end
  end
end
