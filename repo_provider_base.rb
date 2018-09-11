require_relative './basic_auth'
require_relative './rest_client'

# Base class for git repository providers
class RepoProviderBase
  def initialize(options)
    @options = options
  end

  def create_repo
    raise NotImplementedException
  end

  protected

  attr_reader :options

  def basic_auth
    BasicAuth.new(username, password)
  end

  def rest_client
    RestClient.new
  end

  private

  def username
    options[:username]
  end

  def password
    options[:password]
  end
end
