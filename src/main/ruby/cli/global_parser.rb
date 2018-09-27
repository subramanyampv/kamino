# frozen_string_literal: true

require 'optparse'

module CLI
  # Parses arguments passed directly to the CLI
  class GlobalParser
    def initialize(sub_parsers = parsers)
      @sub_parsers = sub_parsers
    end

    def parse(argv)
      # handle global options like --dry-run
      global_options = handle_global_options(argv)

      # get command name
      command_name = argv.shift
      parser = lookup_parser(command_name)
      command_options = parser.parse(argv)

      # assign command to the options as symbol
      command_options[:command] = command_name
      global_options.merge(command_options)
    end

    private

    def handle_global_options(argv)
      options = {}
      global = OptionParser.new do |opts|
        define_global_options(opts, options)
      end

      global.order!(argv)
      options
    end

    def define_global_options(opts, options)
      opts.banner = 'Usage: main.rb [global options] [command [options]]'
      opts.separator ''
      opts.separator <<~HELP
        Available commands:

        #{commands_help}

        Global options:
      HELP
      opts.on('--dry-run', 'Do not actually change anything') do |v|
        options[:dry_run] = v
      end
    end

    def commands_help
      @sub_parsers.map { |p| "  #{parser_name(p)}: #{p.help}" }.join("\n")
    end

    def parser_name(parser)
      parser.class.name
    end

    def lookup_parser(command_name)
      raise OptionParser::MissingArgument, 'No command specified' \
        if command_name.to_s.empty?

      class_name = command_name.split('-').collect(&:capitalize).join + \
                   'RepoParser'

      result = @sub_parsers
               .find { |parser| parser.class.name.end_with?(class_name) }

      raise OptionParser::InvalidOption, "Unknown command #{command_name}" \
        unless result
      result
    end

    def load_command_parser(file)
      # keep only filename without extension
      filename = File.basename(file, '.*')

      # load the module
      require_relative filename

      # convert filename to class name
      class_name = filename.split('_').collect(&:capitalize).join

      # get the class
      clazz = CLI.const_get(class_name)
      clazz.new
    end

    def parsers
      Dir[File.join(__dir__, '*.rb')]
        .reject { |file| file == __FILE__ }
        .map { |file| load_command_parser(file) }
    end
  end
end
