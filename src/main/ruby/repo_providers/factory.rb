require 'delegate'

module RepoProviders
  # Factory for a repo provider.
  class Factory
    def initialize(options)
      @options = options
    end

    def create
      decorate_with_dry_run(create_provider)
    end

    private

    def decorate_with_dry_run(provider)
      if @options[:dry_run]
        DryRunProviderDecorator.new(provider)
      else
        provider
      end
    end

    def create_provider
      case @options[:provider]
      when :github
        GitHub.new(@options)
      when :bitbucket
        Bitbucket.new(@options)
      else
        raise "Unsupported provider #{@options[:provider]}"
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
