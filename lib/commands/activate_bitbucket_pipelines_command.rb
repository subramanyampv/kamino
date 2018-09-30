# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Activates a repository in Bitbucket Pipelines.
  class ActivateBitbucketPipelinesCommand
    def initialize(options)
      @bitbucket = RepoProviders.create(options.merge(provider: :bitbucket))
    end

    def run
      @bitbucket.activate_repo
    end
  end
end
