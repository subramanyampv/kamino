require 'json'
require 'net/http'

class Travis
  def activate_repo(owner, repo)
    slug = owner + '%2F' + repo
    uri = URI('https://api.travis-ci.org/repo/' + slug + '/activate')
    req = Net::HTTP::Post.new(uri)
    req['Authorization'] = 'token ' + token
    req['Travis-API-Version'] = '3'
    res = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
      http.request(req)
    end
    JSON.parse(res.body)
  end

  private

  def token
    ENV['TRAVIS_TOKEN']
  end
end
