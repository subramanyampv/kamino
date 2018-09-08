require 'json'
require 'net/http'

# Utility class to simplify REST calls
class RestClient
  def get(url, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
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

  def post(url, body, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Post.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
    req.body = JSON.generate(body)
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

  def put(url, body, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Put.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
    req.body = JSON.generate(body)
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

  def delete(url, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Delete.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
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

  def apply_basic_auth(req, basic_auth)
    if !basic_auth.empty?
      req.basic_auth basic_auth.username, basic_auth.password
    end
  end
end
