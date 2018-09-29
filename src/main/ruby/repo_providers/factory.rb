# frozen_string_literal: true

require 'delegate'
require_relative './github'
require_relative './bitbucket'

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

  # A decorator for a repo provider which does not execute actions
  # such as create or delete repository.
  class DryRunProviderDecorator < SimpleDelegator
    def create_repo
      puts 'Would have created repo'
    end

    def delete_repo
      puts 'Would have deleted repo'
    end

    def activate_repo
      puts 'Would have activated repo'
    end
  end
end
