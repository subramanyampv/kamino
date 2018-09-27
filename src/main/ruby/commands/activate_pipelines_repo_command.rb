# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Activates a repository in Bitbucket Pipelines.
  class ActivatePipelinesRepoCommand
    def initialize(options)
      @options = options
      @options[:provider] = :bitbucket
      @bitbucket = RepoProviders.create(@options)
    end

    def run
      @bitbucket.activate_repo
    end
  end
end
