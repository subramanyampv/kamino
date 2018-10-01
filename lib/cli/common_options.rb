# frozen_string_literal: true

# Mixin for defining common command line options.
module CommonOptionsMixin
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

  def token_option(opts)
    hint = 'The token to connect to Travis'
    opts.on('-tTOKEN', '--token=PASSWORD', hint) do |v|
      @options[:token] = v
    end
  end
end
