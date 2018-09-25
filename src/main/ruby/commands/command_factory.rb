# frozen_string_literal: true

require_relative './create_repo_command'
require_relative './delete_repo_command'
require_relative './init_repo_command'
require_relative './activate_travis_repo_command'
require_relative './deactivate_travis_repo_command'
require_relative './activate_pipelines_repo_command'
require_relative '../repo_providers/factory'
require_relative '../file_system'
require_relative '../git'
require_relative '../travis'

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
      set_provider(command, options) if command.respond_to?(:provider=)
      set_git(command, options) if command.respond_to?(:git=)
      set_file_system(command, options) if command.respond_to?(:file_system=)
      set_travis(command, options) if command.respond_to?(:travis=)
      command
    end

    private

    def set_provider(command, options)
      command.provider = RepoProviders::Factory.new.create(options)
    end

    def set_git(command, options)
      command.git = GitFactory.new.create(dry_run: options[:dry_run] == true)
    end

    def set_file_system(command, options)
      command.file_system = FileSystemFactory.new.create(
        dry_run: options[:dry_run] == true
      )
    end

    def set_travis(command, options)
      command.travis = TravisFactory.new.create(options)
    end
  end
end
