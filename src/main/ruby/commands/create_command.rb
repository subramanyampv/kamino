require_relative '../bitbucket'
require_relative '../github'

module Commands
  # Creates a new repository.
  class CreateCommand
    def initialize(options)
      @options = options
    end

    def run
      provider = create_provider
      if provider.repo_exists?
        puts 'Repo already exists'
      elsif @options[:dry_run]
        puts 'Would create repo'
      else
        provider.create_repo unless provider.repo_exists?
      end
    end

    private

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
end
