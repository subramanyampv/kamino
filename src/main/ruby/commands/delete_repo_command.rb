# frozen_string_literal: true

module Commands
  # Deletes an existing repository.
  class DeleteRepoCommand
    def initialize(options)
      @options = options
    end

    attr_accessor :provider

    def run
      if @provider.repo_exists?
        @provider.delete_repo
      else
        puts 'Repo does not exist'
      end
    end
  end
end
