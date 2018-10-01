# frozen_string_literal: true

require 'optparse'

module CLI
  # Parses arguments passed directly to the CLI
  class GlobalParser
    # Creates an instance of this class.
    # sub_parsers is a Hash where keys are the command names
    # and values are instances of command parsers.
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

    # rubocop:disable Metrics/LineLength
    def commands_help
      @sub_parsers.map { |command_name, parser| "  #{command_name}: #{parser.help}" }.join("\n")
    end
    # rubocop:enable Metrics/LineLength

    def parser_name(parser)
      parser.class.name
    end

    def lookup_parser(command_name)
      raise OptionParser::MissingArgument, 'No command specified' \
        if command_name.to_s.empty?

      result = @sub_parsers[command_name]

      raise OptionParser::InvalidOption, "Unknown command #{command_name}" \
        unless result
      result
    end

    # Loads all command parsers from the current directory,
    # excluding this file.
    def parsers
      key_value_array = Dir[File.join(__dir__, '*_parser.rb')]
                        .reject { |file| file == __FILE__ }
                        .map { |file| create_parser_key_value(file) }
      Hash[key_value_array]
    end

    # Creates a key-value pair consisting of a command name
    # and a parser instance.
    # The command name is based on the filename by replacing
    # underscores with hyphens, removing the 'parser' suffix.
    def create_parser_key_value(file)
      # keep only filename without extension
      filename = File.basename(file, '.*')
      parser = create_parser(filename)
      command_name = filename.gsub('_parser', '').tr('_', '-')
      [command_name, parser]
    end

    # Creates a new instance by loading the given filename.
    # The file must contain a class with the same name,
    # but with PascalCase convention.
    # Example: if the filename is create_parser, the expected class
    # is CreateParser.
    def create_parser(filename)
      # load the module
      require_relative filename

      # convert filename to class name
      class_name = filename.split('_').collect(&:capitalize).join

      # get the class
      clazz = CLI.const_get(class_name)
      clazz.new
    end
  end
end
