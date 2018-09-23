# frozen_string_literal: true

module Commands
  # Deactivates a repository in Travis.
  class DeactivateTravisRepoCommand
    def initialize(options)
      @options = options
    end

    attr_accessor :travis

    def run
      travis.deactivate_repo
    end
  end
end
