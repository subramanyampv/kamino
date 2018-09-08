# Base class for git repository providers
class RepoProviderBase
  def initialize(repo_options, server_options)
    @repo_options   = repo_options
    @server_options = server_options
  end

  def create_repo
    raise NotImplementedException
  end

  protected

  attr_reader :repo_options

  attr_reader :server_options
end
