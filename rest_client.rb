require 'json'
require 'net/http'

# Utility class to simplify REST calls
class RestClient
  def get(url, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
    call uri, req
  end

  def post(url, body, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Post.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
    req.body = JSON.generate(body)
    call uri, req
  end

  def put(url, body, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Put.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
    req.body = JSON.generate(body)
    call uri, req
  end

  def delete(url, basic_auth: nil)
    uri = URI(url)
    req = Net::HTTP::Delete.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
    req.body = ''
    call uri, req
  end

  private

  def apply_basic_auth(req, basic_auth)
    return if basic_auth.empty?
    req.basic_auth basic_auth.username, basic_auth.password
  end

  def call(uri, req)
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    handle_response_with_body res
  end

  def handle_response_with_body(res)
    case res
    when Net::HTTPSuccess then
      body = res.body
      nil if !body || body.empty?
      JSON.parse(body)
    else
      raise RestClientError.new(res.code, res.message, res.body)
    end
  end
end

# An error that is thrown when the RestClient gets a non-successful code.
class RestClientError < StandardError
  def initialize(code, message, body)
    @code = code
    @message = message
    @body = body
  end

  attr_reader :code
  attr_reader :message
  attr_reader :body

  def to_s
    "#{@code} - #{@message} - #{@body}"
  end
end
