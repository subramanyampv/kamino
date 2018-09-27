# frozen_string_literal: true

require_relative '../travis'

module Commands
  # Deactivates a repository in Travis.
  class DeactivateTravisRepoCommand
    def initialize(options)
      @options = options
      @travis = TravisFactory.create(options)
    end

    def run
      @travis.deactivate_repo
    end
  end
end
