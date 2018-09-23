# frozen_string_literal: true

require 'optparse'

module CLI
  # Parser for the activate travis repo sub-command,
  # which activates an existing repo in Travis.
  class ActivateTravisRepoParser
    def initialize
      # collect options here
      @options = {}
    end

    def name
      'activate-travis-repo'
    end

    def help
      'Activates a repository in Travis, allowing it to run builds'
    end

    def parse(argv)
      option_parser = OptionParser.new do |opts|
        opts.banner = <<~HERE
          Usage: main.rb [global options] activate-travis-repo [options]
        HERE
        define_options(opts)
      end

      option_parser.order!(argv)
      check_missing_options
      @options
    end

    private

    def define_options(opts)
      name_option(opts)
      owner_option(opts)
      token_option(opts)
    end

    def name_option(opts)
      opts.on('-nNAME', '--name=NAME', 'The name of the repository') do |v|
        @options[:name] = v
      end
    end

    def owner_option(opts)
      opts.on('-oOWNER', '--owner=OWNER', 'The owner of the repository') do |v|
        @options[:owner] = v
      end
    end

    def token_option(opts)
      hint = 'The token to connect to Travis'
      opts.on('-tTOKEN', '--token=PASSWORD', hint) do |v|
        @options[:token] = v
      end
    end

    def check_missing_options
      mandatory = %i[name owner token]
      missing = mandatory.select { |p| @options[p].nil? }
      raise OptionParser::MissingArgument, missing.join(', ') \
        unless missing.empty?
    end
  end
end
