# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Creates a new repository.
  class CreateCommand
    def initialize(options)
      @options = options
      @provider = RepoProviders.create(options)
    end

    def run
      if @provider.repo_exist?
        puts 'Repo already exists'
      else
        @provider.create_repo(@options)
      end
    end
  end
end
