# frozen_string_literal: true

require_relative "../repo_providers/factory"
require_relative "../file_system"
require_relative "../git"
require_relative "../travis"

module Commands
  # Initializes an existing repository.
  class InitCommand
    def initialize(options)
      @options = options

      @provider = RepoProviders.create(options)

      @git = GitFactory.create(options)
      @git.clone_url = @provider.clone_url
      @git.repo_name = @options[:name]
      @git.clone_dir = @options[:clone_dir]

      @file_system = FileSystemFactory.create(options)
      @travis = TravisFactory.create(options)
    end

    def run
      if @provider.repo_exist?
        @git.clone_or_pull
        init_result = init_readme
        commit_message = commit_message(init_result)
        push(commit_message) if commit_message
      else
        puts "Repo does not exist"
      end
    end

    private

    def commit_message(init_result)
      commit_messages = {
        created: "Added README",
        added_badge: "Added Travis badge to README"
      }
      commit_messages[init_result]
    end

    def push(commit_message)
      @git.add "README.md"
      @git.commit commit_message
      @git.push
    end

    # Initializes the README file.
    # If it does not exist, it will be created.
    # It is exists, it will be updated to satisfy the requested options.
    def init_readme
      readme_file = File.join(@git.working_dir, "README.md")
      if @file_system.file?(readme_file)
        append_badge(readme_file) if @options[:travis_badge]
      else
        create_readme readme_file
      end
    end

    # Appends the Travis badge to the README file.
    def append_badge(readme_file)
      badge = @travis.badge
      if @file_system.line_exist?(readme_file, badge)
        puts "Readme already exists and has badge, skipping"
      else
        @file_system.append(readme_file, badge)
        :added_badge
      end
    end

    # Creates a new README file.
    # Optionally adds the Travis badge.
    def create_readme(readme_file)
      puts "Creating new readme file"
      contents = <<~HERE
        # #{@options[:name]}
        #{@options[:description]}
      HERE

      contents += "#{@travis.badge}\n" if @options[:travis_badge]

      @file_system.write(readme_file, contents)
      :created
    end
  end
end
