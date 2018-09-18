# frozen_string_literal: true

require 'delegate'
require_relative './github'
require_relative './bitbucket'

module RepoProviders
  # Factory for a repo provider.
  class Factory
    def create(options)
      provider = create_provider(options)
      if options[:dry_run]
        DryRunProviderDecorator.new(provider)
      else
        provider
      end
    end

    private

    def create_provider(options)
      case options[:provider]
      when :github
        GitHub.new(options)
      when :bitbucket
        Bitbucket.new(options)
      else
        raise "Unsupported provider #{options[:provider]}"
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
  end
end
