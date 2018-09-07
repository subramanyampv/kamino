require 'json'
require 'net/http'

# Utility class to simplify REST calls
class RestClient
  def get(url, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    req.content_type = 'application/json'
    basic_auth.apply req if basic_auth
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end
    JSON.parse(res.body)
  end

  def post(url, body, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Post.new(uri)
    req.content_type = 'application/json'
    basic_auth.apply req if basic_auth
    req.body = JSON.generate(body)
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end
    JSON.parse(res.body)
  end

  def put(url, body, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Put.new(uri)
    req.content_type = 'application/json'
    basic_auth.apply req if basic_auth
    req.body = JSON.generate(body)
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end
    JSON.parse(res.body)
  end

  def delete(url, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Delete.new(uri)
    req.content_type = 'application/json'
    basic_auth.apply req if basic_auth
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
end

class BasicAuth
  attr_reader :username
  attr_reader :password

  def initialize(username, password)
    @username = username
    @password = password
  end

  def empty?
    username.to_s.empty?
  end

  def apply(req)
    req.basic_auth username, password if !empty?
  end

  def ==(other)
    username == other.username && password == other.password
  end
end
