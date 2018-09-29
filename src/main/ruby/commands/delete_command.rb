# frozen_string_literal: true

require_relative '../repo_providers/factory'

module Commands
  # Deletes an existing repository.
  class DeleteCommand
    def initialize(options)
      @options = options
      @provider = RepoProviders.create(options)
    end

    def run
      if @provider.repo_exists?
        @provider.delete_repo
      else
        puts 'Repo does not exist'
      end
    end
  end
end
