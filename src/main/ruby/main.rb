require_relative './cli/global_parser'
require_relative './commands/create_command'

def command_classes
  {
    create: Commands::CreateCommand
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
