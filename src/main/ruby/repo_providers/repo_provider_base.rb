require_relative '../basic_auth'
require_relative '../rest_client'

module RepoProviders
  # Base class for git repository providers
  class RepoProviderBase
    def initialize(options, rest_client = RestClient.new)
      @options = options
      @rest_client = rest_client
      raise 'Owner is mandatory' if options[:owner].to_s.empty?
    end

    protected

    attr_reader :options
    attr_reader :rest_client

    def basic_auth
      BasicAuth.new(username, password)
    end

    private

    def username
      options[:username]
    end

    def password
      options[:password]
    end
  end
end
