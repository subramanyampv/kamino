# frozen_string_literal: true

require_relative "./deactivate_bitbucket_pipelines_command"
require_relative "./deactivate_travis_command"
require_relative "./delete_command"

module Commands
  # Deactivates CI and deletes an existing repository.
  class DownCommand
    def initialize(options)
      @options = options
    end

    def run
      deactivate_bitbucket_pipelines if @options[:provider] == :bitbucket
      deactivate_travis if @options[:token]
      delete_repo
    end

    private

    def deactivate_bitbucket_pipelines
      cmd = DeactivateBitbucketPipelinesCommand.new(@options)
      cmd.run
    end

    def deactivate_travis
      cmd = DeactivateTravisCommand.new(@options)
      cmd.run
    end

    def delete_repo
      cmd = DeleteCommand.new(@options)
      cmd.run
    end
  end
end
