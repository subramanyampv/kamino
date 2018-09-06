require 'json'
require 'net/http'
require_relative '/repo_provider_base'

class Bitbucket < RepoProviderBase
  def create_repo(owner, name)
    # https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D#post
    uri = URI("https://api.bitbucket.org/2.0/repositories/#{owner}/#{name}")
    req = Net::HTTP::Post.new(uri)
    req.basic_auth username, password
    req.body = JSON.generate(
      scm: 'git',
      is_private: true,
      description: 'a test repository created automatically',
      language: 'java',
      fork_policy: 'no_forks',
      mainbranch: {
        type: 'branch',
        name: 'master'
      }
    )
    req.content_type = 'application/json'
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    case res
    when Net::HTTPSuccess then
      JSON.parse(res.body)
    else
      raise "#{res.code} - #{res.message} - #{res.body}"
    end
  end

  def delete_repo(owner, name)
    uri = URI("https://api.bitbucket.org/2.0/repositories/#{owner}/#{name}")
    req = Net::HTTP::Delete.new(uri)
    req.basic_auth username, password
    req.body = ''
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    case res
    when Net::HTTPSuccess then
    else
      raise "#{res.code} - #{res.message} - #{res.body}"
    end
  end

  private

  def username
    ENV['BITBUCKET_USERNAME']
  end

  def password
    ENV['BITBUCKET_PASSWORD']
  end
end
