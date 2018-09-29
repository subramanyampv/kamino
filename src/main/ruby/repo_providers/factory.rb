# frozen_string_literal: true

require_relative './github'
require_relative './bitbucket'
require_relative './dry_run'

# Module regarding git repository providers.
module RepoProviders
  class << self
    # Factory for a repo provider.
    def create(options)
      instance = create_provider(options[:provider])
      instance.name = options[:name]
      instance.owner = options[:owner]
      instance.username = options[:username]
      instance.password = options[:password]
      if options[:dry_run]
        DryRunProviderDecorator.new(instance)
      else
        instance
      end
    end

    private

    def create_provider(provider)
      case provider
      when :github
        GitHub.new
      when :bitbucket
        Bitbucket.new
      else
        raise "Unsupported provider #{provider}"
      end
    end
  end
end
