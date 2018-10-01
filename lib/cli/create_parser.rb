# frozen_string_literal: true

require 'optparse'
require_relative './common_options'

module CLI
  # Parser for the create repository sub-command which creates a new
  # repository.
  class CreateParser
    def initialize
      # collect options here
      @options = {}
    end

    def help
      'Creates a new git repository'
    end

    def parse(argv)
      option_parser = OptionParser.new do |opts|
        opts.banner = 'Usage: main.rb [global options] create [options]'
        define_options(opts)
      end

      option_parser.order!(argv)
      check_missing_options
      @options
    end

    private

    include CommonOptionsMixin

    def define_options(opts)
      name_option(opts)
      owner_option(opts)
      description_option(opts)
      language_option(opts)
      provider_option(opts)
      username_option(opts)
      password_option(opts)
    end

    def description_option(opts)
      hint = 'A short description of the repository'
      opts.on('--description=DESCRIPTION', hint) do |v|
        @options[:description] = v
      end
    end

    def language_option(opts)
      hint = 'The programming language'
      opts.on('-lLANGUAGE', '--language=LANGUAGE', hint) do |v|
        @options[:language] = v
      end
    end

    def check_missing_options
      mandatory = %i[name owner provider username password]
      missing = mandatory.select { |p| @options[p].nil? }
      raise OptionParser::MissingArgument, missing.join(', ') \
        unless missing.empty?
    end
  end
end
