# frozen_string_literal: true

require_relative './cli/global_parser'
require_relative './commands/create_repo_command'
require_relative './commands/delete_repo_command'
require_relative './commands/init_repo_command'

# Main class
class Main
end

def command_classes
  {
    create: Commands::CreateRepoCommand,
    delete: Commands::DeleteRepoCommand,
    init: Commands::InitRepoCommand
  }
end

# entrypoint for the program
def main
  parser = CLI::GlobalParser.new
  options = parser.parse(ARGV)
  puts options
  command = command_classes[options[:command]].new(options)
  command.run
end

main if $PROGRAM_NAME == __FILE__
