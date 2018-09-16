# frozen_string_literal: true

require_relative '../repo_providers/factory'
require_relative '../git'

module Commands
  # Initializes an existing repository.
  class InitRepoCommand
    def initialize(options, provider_factory = RepoProviders::Factory)
      @options = options
      @provider_factory = provider_factory
    end

    def run
      provider = @provider_factory.new(@options).create
      if provider.repo_exists?
        git = clone_or_pull(provider)
        add_readme(git)
        true
      else
        puts 'Repo does not exist'
        false
      end
    end

    private

    def clone_or_pull(provider)
      clone_url = provider.clone_url
      repo_name = @options[:name]
      clone_dir = @options[:clone_dir]
      git = Git.new(clone_url, repo_name, clone_dir)
      git.clone_or_pull
      git
    end

    def add_readme(git)
      readme_file = File.join(git.working_dir, 'README.md')
      if File.file?(readme_file)
        puts 'Readme already exists, skipping'
      else
        puts 'Creating new readme file'
        # TODO: support dry run
        # File.open(readme_file, 'w') do |f|
        #   f.puts("# #{@options[:name]}")
        #   f.puts(@options[:description])
        # end
        # git.add 'README.md'
        # git.commit 'Added README'
        # git.push
      end
    end
  end
end
