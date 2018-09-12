require_relative 'arg_handler'
require_relative 'bitbucket'
require_relative 'github'
require_relative 'git'
require_relative 'travis'

def create_provider(options)
  case options[:provider]
  when :github
    GitHub.new(options)
  when :bitbucket
    Bitbucket.new(options)
  else
    raise "Unsupported provider #{options[:provider]}"
  end
end

# entrypoint for the program
def main
  arg_handler = ArgHandler.new
  options = arg_handler.parse(ARGV)
  puts options
end

main if $PROGRAM_NAME == __FILE__
