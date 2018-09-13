require 'optparse'
require_relative './create_sub_command'

module CLI
  # Parses arguments passed directly to the CLI
  class ArgHandler
    def initialize(sub_command_classes = [CreateSubCommand])
      @sub_command_classes = sub_command_classes
    end

    def parse(argv)
      options = {}
      handle_global_options(argv)
      sub_command = argv.shift
      raise OptionParser::MissingArgument, 'No command specified' \
        if sub_command.to_s.empty?
      handle_sub_command(sub_command, argv, options)
    end

    private

    # rubocop:disable Layout/IndentHeredoc
    def handle_global_options(argv)
      help = <<HELP
Available commands:
  create: Creates a new repository
HELP

      global = OptionParser.new do |opts|
        opts.banner = 'Usage: main.rb [global options] [subcommand [options]]'
        opts.separator ''
        opts.separator help
      end

      global.order!(argv)
    end
    # rubocop:enable Layout/IndentHeredoc

    def handle_sub_command(command_name, argv, options)
      sub_command = lookup_command(command_name)
      raise OptionParser::InvalidOption, "Unknown command #{command_name}" \
        unless sub_command
      sub_command.order!(options, argv)
    end

    def lookup_command(command_name)
      result = nil
      @sub_command_classes.each do |sub_command_class|
        sub_command = sub_command_class.new
        if command_name == sub_command.name
          result = sub_command
          break
        end
      end

      result
    end
  end
end
