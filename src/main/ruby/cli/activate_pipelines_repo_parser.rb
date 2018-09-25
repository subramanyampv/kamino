# frozen_string_literal: true

require 'optparse'

module CLI
  # Parser for the activate pipelines repo sub-command,
  # which activates an existing repo in Bitbucket Pipelines.
  class ActivatePipelinesRepoParser
    def initialize
      # collect options here
      @options = {}
    end

    def name
      'activate-pipelines-repo'
    end

    def help
      'Activates a repository in Bitbucket Pipelines, allowing it to run builds'
    end

    def parse(argv)
      option_parser = OptionParser.new do |opts|
        opts.banner = <<~HERE
          Usage: main.rb [global options] activate-pipelines-repo [options]
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
      username_option(opts)
      password_option(opts)
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

    def username_option(opts)
      hint = 'The username to connect to the git provider'
      opts.on('-uUSERNAME', '--username=USERNAME', hint) do |v|
        @options[:username] = v
      end
    end

    def password_option(opts)
      hint = 'The password to connect to the git provider'
      opts.on('--password=PASSWORD', hint) do |v|
        @options[:password] = v
      end
    end

    def check_missing_options
      mandatory = %i[name owner username password]
      missing = mandatory.select { |p| @options[p].nil? }
      raise OptionParser::MissingArgument, missing.join(', ') \
        unless missing.empty?
    end
  end
end
