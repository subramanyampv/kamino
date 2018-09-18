# frozen_string_literal: true

module Commands
  # Creates a new repository.
  class CreateRepoCommand
    def initialize(options)
      @options = options
    end

    attr_accessor :provider

    def run
      if @provider.repo_exists?
        puts 'Repo already exists'
      else
        @provider.create_repo
      end
    end
  end
end
