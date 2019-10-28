# frozen_string_literal: true

require "delegate"
require_relative "./shell"

# Handles git operations. Requires the git executable on the PATH.
class Git
  # Creates an instance of this class.
  def initialize
    @shell = Shell.new
  end

  attr_accessor :clone_url
  attr_accessor :repo_name
  attr_accessor :clone_dir

  # Stages changes of a git repository.
  # +pattern+:: Specifies which changes to stage.
  # By default, all changes will be staged.
  def add(pattern = ".")
    system "git add #{pattern}"
  end

  # Commits all changes of a git repository.
  # +message+:: The commit message.
  def commit(message)
    system "git commit -m \"#{message}\""
  end

  def clone_or_pull
    ensure_clone_dir_exists
    if Dir.exist?(working_dir)
      ensure_remotes_match
      pull
    else
      clone
    end
  end

  def pull
    system "git pull"
  end

  def clone
    @shell.system("git clone #{@clone_url}", chdir: @clone_dir)
  end

  # Pushes changes of a git repository to the remote.
  def push
    system "git push"
  end

  # Gets the working directory of the repository.
  def working_dir
    File.join(@clone_dir, @repo_name)
  end

  # Configures the username and email of the repository.
  def configure(username, email)
    system "git config user.name #{username}"
    system "git config user.email #{email}"
  end

  # Checks out a new branch
  def checkout_new_branch(branch_name)
    system "git checkout -b #{branch_name}"
  end

  private

  # Gets the remote URL of the origin.
  def remote_url
    @shell.backticks "git remote get-url origin", chdir: working_dir
  end

  # Checks if this is an empty repo with no remote ref to pull from
  def empty_repo?
    result = @shell.backticks("git branch -la", chdir: working_dir)
    result.to_s.empty?
  end

  def system(cmd)
    @shell.system cmd, chdir: working_dir
  end

  def ensure_clone_dir_exists
    raise "Directory #{@clone_dir} does not exist" \
      unless Dir.exist?(@clone_dir)
  end

  def ensure_remotes_match
    raise "Directory #{working_dir} exists and points to different remote" \
      unless remote_url == @clone_url
  end
end

# Decorator for Git that cancels out all operations that cause changes.
class DryRunGitDecorator < SimpleDelegator
  def add(pattern = ".")
    puts "Would have added files with pattern #{pattern}"
  end

  def commit(message)
    puts "Would have committed with message #{message}"
  end

  def push
    puts "Would have pushed changes"
  end
end

# Factory for git.
module GitFactory
  def self.create(options)
    git = Git.new
    if options[:dry_run]
      DryRunGitDecorator.new(git)
    else
      git
    end
  end
end
