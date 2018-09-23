# frozen_string_literal: true

require_relative './cli/global_parser'
require_relative './commands/create_repo_command'
require_relative './commands/delete_repo_command'
require_relative './commands/init_repo_command'
require_relative './commands/activate_travis_repo_command'
require_relative './repo_providers/factory'
require_relative './file_system'
require_relative './git'
require_relative './travis'

# Creates command handler instances
class CommandFactory
  def initialize(command_classes =
    {
      create: Commands::CreateRepoCommand,
      delete: Commands::DeleteRepoCommand,
      init: Commands::InitRepoCommand,
      'activate-travis-repo': Commands::ActivateTravisRepoCommand
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

# entrypoint for the program
def main
  command_factory = CommandFactory.new
  parser = CLI::GlobalParser.new
  options = parser.parse(ARGV)
  puts options
  command = command_factory.create_command(options)
  command.run
end

main if $PROGRAM_NAME == __FILE__
