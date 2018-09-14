require_relative './cli/arg_handler'
require_relative './commands/create_command'

def command_classes
  {
    create: Commands::CreateCommand
  }
end

# entrypoint for the program
def main
  arg_handler = CLI::ArgHandler.new
  options = arg_handler.parse(ARGV)
  puts options
  command = command_classes[options[:command]].new(options)
  command.run
end

main if $PROGRAM_NAME == __FILE__
