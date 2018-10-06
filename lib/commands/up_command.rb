# frozen_string_literal: true

require_relative './activate_bitbucket_pipelines_command'
require_relative './activate_travis_command'
require_relative './create_command'
require_relative './init_command'

module Commands
  # Creates a new repository and activates CI.
  class UpCommand
    def initialize(options)
      @options = options
    end

    def run
      create_repo
      init_repo
      activate_bitbucket_pipelines if @options[:provider] == :bitbucket
      activate_travis if @options[:token]
    end

    private

    def create_repo
      cmd = CreateCommand.new(@options)
      cmd.run
    end

    def init_repo
      cmd = InitCommand.new(@options)
      cmd.run
    end

    def activate_bitbucket_pipelines
      cmd = ActivateBitbucketPipelinesCommand.new(@options)
      cmd.run
    end

    def activate_travis
      cmd = ActivateTravisCommand.new(@options)
      cmd.run
    end
  end
end
