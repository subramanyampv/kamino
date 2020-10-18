# frozen_string_literal: true

require_relative "../repo_providers/factory"

module Commands
  # Deletes an existing repository.
  class DeleteCommand
    def initialize(options)
      @provider = RepoProviders.create(options)
    end

    def run
      if @provider.repo_exist?
        @provider.delete_repo
      else
        puts "Repo does not exist"
      end
    end
  end
end
