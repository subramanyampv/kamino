# frozen_string_literal: true

require_relative "../git"
require_relative "../repo_providers/factory"

module Commands
  # Updates the license on multiple repositories.
  class UpdateLicenseCommand
    def initialize(options)
      @options = options
      @git = GitFactory.create(options)
      @repo_provider = RepoProviders.create(options)
    end

    def run
      branch_name = "license-bot"
      repos = @repo_provider.get_repos(@options[:owner])
      repos.each do |repo|
        next unless process_repo(repo, branch_name)

        @repo_provider.create_pr(
          @options[:owner],
          repo["name"],
          branch_name,
          "Updating license"
        )
      end
    end

    private

    def process_repo(repo, branch_name)
      if repo["fork"]
        puts "Ignoring fork"
        return
      end

      if repo["archived"]
        puts "Ignoring archived"
        return
      end

      Dir.mktmpdir do |dir|
        puts dir
        @git.repo_name = repo["name"]
        @git.clone_dir = dir
        @git.clone_url = repo["ssh_url"]
        @git.clone
        @git.configure "license-bot", "license-bot@noreply.com"
        @git.checkout_new_branch branch_name

        has_changes = []
        has_changes << update_license_file(repository.working_dir)
        if has_changes.include?(true)
          @git.add "."
          @git.commit "Updated license copyright to #{Time.now.year}"
          @git.push
        end

        has_changes.include?(true)
      end
    end

    def update_license(line, year)
      if line.start_with?("Copyright (c) ")
        r = /(?<start_year>[0-9]{4})(\-(?<end_year>[0-9]{4}))?/
        match = r.match(line)
        if match && ((match[:end_year] && match[:end_year] != year) || (match[:start_year] != year))
          return line.gsub(r, "#{match[:start_year]}-#{year}")
        end
      end
      line
    end

    def update_license_lines(lines, year)
      has_changes = false
      new_lines = lines.map do |line|
        new_line = update_license(line, year)
        has_changes ||= new_line != line
        new_line
      end
      [new_lines, has_changes]
    end

    def update_license_file(dir)
      filename = File.join(dir, "LICENSE")
      if File.exist?(filename)
        lines = File.readlines(filename)
        new_lines, has_changes = update_license_lines(lines, Time.now.year.to_s)
        if has_changes
          open(filename, "w") do |f|
            new_lines.each { |line| f.puts(line) }
          end
        end

        has_changes
      end
    end
  end
end
