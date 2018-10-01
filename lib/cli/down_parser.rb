# frozen_string_literal: true

require 'optparse'
require_relative './common_options'

module CLI
  # Parser for the down command.
  class DownParser
    def initialize
      # collect options here
      @options = {}
    end

    def help
      'Composite command which deactivates CI and deletes a git repository'
    end

    def parse(argv)
      option_parser = OptionParser.new do |opts|
        opts.banner = 'Usage: main.rb [global options] down [options]'
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
      provider_option(opts)
      username_option(opts)
      password_option(opts)
      token_option(opts)
    end

    def check_missing_options
      mandatory = %i[name owner provider username password]
      missing = mandatory.select { |p| @options[p].nil? }
      raise OptionParser::MissingArgument, missing.join(', ') \
        unless missing.empty?
    end
  end
end
