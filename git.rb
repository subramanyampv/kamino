require_relative './shell'

# Handles git operations. Requires the git executable on the PATH.
class Git
  # Creates an instance of this class.
  # +clone_url+::      The URL of the remote repository.
  # +repo_name+::      The name of the repository.
  # +clone_dir_root+:: The parent directory in which to clone. The repository
  #                    will be cloned in a directory inside that directory.
  def initialize(clone_url, repo_name, clone_dir_root)
    @clone_url = clone_url
    @repo_name = repo_name
    @clone_dir_root = clone_dir_root
    @shell = Shell.new
  end

  # for tests
  attr_accessor :shell

  # Stages changes of a git repository.
  # +pattern+:: Specifies which changes to stage.
  # By default, all changes will be staged.
  def add(pattern = '.')
    system "git add #{pattern}"
  end

  # Commits all changes of a git repository.
  # +message+:: The commit message.
  def commit(message)
    system "git commit -m \"#{message}\""
  end

  def clone_or_pull
    ensure_clone_dir_root_exists
    if Dir.exist?(working_dir)
      ensure_remotes_match
      system 'git pull' unless empty_repo?
    else
      @shell.system(
        "git clone #{@clone_url}", chdir: @clone_dir_root
      )
    end
  end

  # Pushes changes of a git repository to the remote.
  def push
    system 'git push'
  end

  private

  # Gets the remote URL of the origin.
  def remote_url
    @shell.backticks 'git remote get-url origin', chdir: working_dir
  end

  # Checks if this is an empty repo with no remote ref to pull from
  def empty_repo?
    result = @shell.backticks('git branch -la', chdir: working_dir)
    result.to_s.empty?
  end

  def system(cmd)
    @shell.system cmd, chdir: working_dir
  end

  def working_dir
    File.join(@clone_dir_root, @repo_name)
  end

  def ensure_clone_dir_root_exists
    raise "Directory #{@clone_dir_root} does not exist" \
      unless Dir.exist?(@clone_dir_root)
  end

  def ensure_remotes_match
    raise "Directory #{working_dir} exists and points to different remote" \
      unless remote_url == @clone_url
  end
end
