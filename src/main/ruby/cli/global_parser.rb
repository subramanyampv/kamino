# frozen_string_literal: true

require 'optparse'
require_relative './create_repo_parser'
require_relative './delete_repo_parser'
require_relative './init_repo_parser'
require_relative './activate_travis_repo_parser'
require_relative './deactivate_travis_repo_parser'

module CLI
  # Parses arguments passed directly to the CLI
  class GlobalParser
    def initialize(sub_parser_classes = [
      CreateRepoParser,
      DeleteRepoParser,
      InitRepoParser,
      ActivateTravisRepoParser,
      DeactivateTravisRepoParser
    ])
      @sub_parser_classes = sub_parser_classes
    end

    def parse(argv)
      # handle global options like --dry-run
      global_options = handle_global_options(argv)

      # get command name
      command_name = argv.shift
      parser = lookup_parser(command_name)
      command_options = parser.parse(argv)

      # assign command to the options as symbol
      command_options[:command] = command_name.to_sym
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

    # rubocop:disable Metrics/MethodLength
    def define_global_options(opts, options)
      opts.banner = 'Usage: main.rb [global options] [command [options]]'
      opts.separator ''
      opts.separator <<~HELP
        Available commands:
          create                 : Creates a new repository
          delete                 : Deletes an existing repository
          init                   : Initializes an existing repository with essentials
          activate-travis-repo   : Activates a repo in Travis
          deactivate-travis-repo : Deactivates a repo in Travis

        Global options:
      HELP
      opts.on('--dry-run', 'Do not actually change anything') do |v|
        options[:dry_run] = v
      end
    end
    # rubocop:enable Metrics/MethodLength

    def lookup_parser(command_name)
      raise OptionParser::MissingArgument, 'No command specified' \
        if command_name.to_s.empty?

      result = @sub_parser_classes
               .collect(&:new) # create new parser instance
               .find { |parser| parser.name == command_name }

      raise OptionParser::InvalidOption, "Unknown command #{command_name}" \
        unless result
      result
    end
  end
end
