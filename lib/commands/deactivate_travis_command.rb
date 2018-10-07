# frozen_string_literal: true

require_relative '../travis'

module Commands
  # Deactivates a repository in Travis.
  class DeactivateTravisCommand
    def initialize(options)
      @options = options
      @travis = TravisFactory.create(options)
    end

    def run
      @travis.sync
      @travis.deactivate_repo
    end
  end
end
