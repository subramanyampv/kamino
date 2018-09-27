# frozen_string_literal: true

require_relative '../travis'

module Commands
  # Activates a repository in Travis.
  class ActivateTravisRepoCommand
    def initialize(options)
      @options = options
      @travis = TravisFactory.create(options)
    end

    def run
      @travis.activate_repo
    end
  end
end
