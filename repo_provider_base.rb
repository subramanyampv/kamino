# Base class for git repository providers
class RepoProviderBase
  def initialize(repo_options, server_options)
    @repo_options   = repo_options
    @server_options = server_options
  end

  def create_repo
    fail NotImplementedException
  end

  protected

  def repo_options
    @repo_options
  end

  def server_options
    @server_options
  end
end
