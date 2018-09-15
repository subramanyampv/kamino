# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Creates a new repository.
  class CreateRepoCommand
    def initialize(options, provider_factory = RepoProviders::Factory)
      @options = options
      @provider_factory = provider_factory
    end

    def run
      provider = @provider_factory.new(@options).create
      if provider.repo_exists?
        puts 'Repo already exists'
      else
        provider.create_repo
      end
    end
  end
end
