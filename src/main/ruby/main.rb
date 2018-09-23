# frozen_string_literal: true

require_relative './cli/global_parser'
require_relative './commands/command_factory'

# entrypoint for the program
def main
  command_factory = Commands::CommandFactory.new
  parser = CLI::GlobalParser.new
  options = parser.parse(ARGV)
  puts options
  command = command_factory.create_command(options)
  command.run
end

main if $PROGRAM_NAME == __FILE__
