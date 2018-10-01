# frozen_string_literal: true

require 'optparse'
require_relative './common_options'

module CLI
  # Parser for the deactivate Bitbucket pipelines sub-command,
  # which deactivates an existing repo in Bitbucket Pipelines.
  class DeactivateBitbucketPipelinesParser
    def initialize
      # collect options here
      @options = {}
    end

    def help
      'Deactivates a repository in Bitbucket Pipelines'
    end

    def parse(argv)
      option_parser = OptionParser.new do |opts|
        opts.banner = <<~HERE
          Usage: main.rb [global options] deactivate-bitbucket-pipelines [options]
        HERE
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
      username_option(opts)
      password_option(opts)
    end

    def check_missing_options
      mandatory = %i[name owner username password]
      missing = mandatory.select { |p| @options[p].nil? }
      raise OptionParser::MissingArgument, missing.join(', ') \
        unless missing.empty?
    end
  end
end
