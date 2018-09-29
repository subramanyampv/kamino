# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Deactivates a repository in Bitbucket Pipelines.
  class DeactivateBitbucketPipelinesCommand
    def initialize(options)
      @bitbucket = RepoProviders.create(options.merge(provider: :bitbucket))
    end

    def run
      @bitbucket.deactivate_repo
    end
  end
end
