class Repository
  attr_reader :working_dir

  def initialize(repo)
    @name = repo["name"]
    @ssh_url = repo["ssh_url"]
    @working_dir = nil
  end

  def clone(root_dir)
    raise "failed to clone" unless system("git clone #{@ssh_url}", chdir: root_dir)

    @working_dir = File.join(root_dir, @name)
  end

  def checkout(branch_name)
    raise "failed to checkout" unless system("git checkout -b #{branch_name}", chdir: @working_dir)
  end

  def status()
    raise "failed to get status" unless system("git status", chdir: @working_dir)
  end

  def configure(username, email)
    raise "failed to configure user name" unless system("git config user.name #{username}", chdir: @working_dir)
    raise "failed to configure user email" unless system("git config user.email #{email}", chdir: @working_dir)
  end

  def add(file)
    raise "failed to add" unless system("git", "add", file, chdir: @working_dir)
  end

  def commit(message)
    raise "failed to commit" unless system("git", "commit", "-m", message, chdir: @working_dir)
  end

  def push(branch_name)
    raise "failed to push" unless system("git", "push", "--force-with-lease", "-u", "origin", branch_name, chdir: @working_dir)
  end
end
