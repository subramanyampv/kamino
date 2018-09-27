# frozen_string_literal: true

require_relative './create_repo_command'
require_relative './delete_repo_command'
require_relative './init_repo_command'
require_relative './activate_travis_repo_command'
require_relative './deactivate_travis_repo_command'
require_relative './activate_pipelines_repo_command'
require_relative '../file_system'
require_relative '../git'

module Commands
  # Creates command handler instances
  class CommandFactory
    def initialize(command_classes =
      {
        create: Commands::CreateRepoCommand,
        delete: Commands::DeleteRepoCommand,
        init: Commands::InitRepoCommand,
        'activate-travis-repo': Commands::ActivateTravisRepoCommand,
        'deactivate-travis-repo': Commands::DeactivateTravisRepoCommand,
        'activate-pipelines-repo': Commands::ActivatePipelinesRepoCommand
      })
      @command_classes = command_classes
    end

    def create_command(options)
      command = @command_classes[options[:command]].new(options)
      set_file_system(command, options) if command.respond_to?(:file_system=)
      command
    end

    private

    def set_file_system(command, options)
      command.file_system = FileSystemFactory.new.create(
        dry_run: options[:dry_run] == true
      )
    end
  end
end
