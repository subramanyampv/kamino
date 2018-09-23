# frozen_string_literal: true

module Commands
  # Activates a repository in Travis.
  class ActivateTravisRepoCommand
    def initialize(options)
      @options = options
    end

    attr_accessor :travis

    def run
      travis.activate_repo
    end
  end
end
