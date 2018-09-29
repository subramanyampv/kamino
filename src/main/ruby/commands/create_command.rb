# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Creates a new repository.
  class CreateCommand
    def initialize(options)
      @description = options[:description]
      @provider = RepoProviders.create(options)
    end

    def run
      if @provider.repo_exists?
        puts 'Repo already exists'
      else
        @provider.create_repo(description: @description)
      end
    end
  end
end
