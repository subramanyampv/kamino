require 'json'
require 'net/http'

puts 'hello, world'

def username
  ENV['GITHUB_USERNAME']
end

def password
  ENV['GITHUB_PASSWORD']
end

def get_repos
  # curl -u username:password 'https://api.github.com/user/repos'
  # if 2FA is on, password needs to replaced by personal access token
  uri = URI('https://api.github.com/user/repos')
  req = Net::HTTP::Get.new(uri)
  req.basic_auth username, password
  res = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
    http.request(req)
  end
  puts JSON.parse(res.body)
end

def create_repo
  uri = URI('https://api.github.com/user/repos')
  req = Net::HTTP::Post.new(uri)
  req.basic_auth username, password
  req.body = JSON.generate({
    :name => 'test',
    :description => 'a test repository created automatically',
    :auto_init => true,
    :gitignore_template => 'Maven',
    :license_template => 'mit'
  })
  res = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
    http.request(req)
  end
  puts JSON.parse(res.body)
end

get_repos
#create_repo
