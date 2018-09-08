require_relative './basic_auth'
require_relative './rest_client'

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

  def basic_auth
    BasicAuth.new(username, password)
  end

  def rest_client
    RestClient.new
  end

  private

  def username
    server_options.username
  end

  def password
    server_options.password
  end
end
