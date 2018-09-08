# Handles git operations. Requires the git executable on the PATH.
class Git
  # Clones a repository.
  # +clone_url+::      The URL of the remote repository.
  # +clone_dir_root+:: The parent directory in which to clone. The repository
  #                    will be cloned in a directory inside that directory.
  def clone(clone_url, clone_dir_root)
    Kernel.system("git clone #{clone_url}", chdir: clone_dir_root)
  end
end

# Represents a local working directory that holds a git repository.
class GitWorkingDirectory
  # Creates a new instance of this class.
  # +working_dir+:: The local working directory.
  def initialize(working_dir)
    @working_dir = working_dir
  end

  # Stages changes of a git repository.
  # +pattern+:: Specifies which changes to stage.
  # By default, all changes will be staged.
  def add(pattern = '.')
    Kernel.system("git add #{pattern}", chdir: @working_dir)
  end

  # Commits all changes of a git repository.
  # +message+:: The commit message.
  def commit(message)
    Kernel.system("git commit -m \"#{message}\"", chdir: @working_dir)
  end

  # Pushes changes of a git repository to the remote.
  def push
    Kernel.system('git push', chdir: @working_dir)
  end
end
