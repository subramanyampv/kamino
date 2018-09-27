# frozen_string_literal: true

require 'optparse'

module CLI
  # Parser for the create repository sub-command which creates a new
  # repository.
  class CreateRepoParser
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

    def define_options(opts)
      name_option(opts)
      owner_option(opts)
      description_option(opts)
      language_option(opts)
      provider_option(opts)
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

    def provider_option(opts)
      hint = 'Select provider (github, bitbucket)'
      providers = %i[github bitbucket]
      opts.on('-pPROVIDER', '--provider=PROVIDER', providers, hint) do |v|
        @options[:provider] = v
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
      mandatory = %i[name owner provider username password]
      missing = mandatory.select { |p| @options[p].nil? }
      raise OptionParser::MissingArgument, missing.join(', ') \
        unless missing.empty?
    end
  end
end
