# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Deletes an existing repository.
  class DeleteRepoCommand
    def initialize(options, provider_factory = RepoProviders::Factory)
      @options = options
      @provider_factory = provider_factory
    end

    def run
      provider = @provider_factory.new(@options).create
      if provider.repo_exists?
        provider.delete_repo
      else
        puts 'Repo does not exist'
      end
    end
  end
end
