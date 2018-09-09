require 'json'
require 'net/http'

# Utility class to simplify REST calls
class RestClient
  def get(url, basic_auth: nil, headers: nil)
    act(url, Net::HTTP::Get, nil, basic_auth, headers)
  end

  def post(url, body, basic_auth: nil, headers: nil)
    act(url, Net::HTTP::Post, JSON.generate(body), basic_auth, headers)
  end

  def put(url, body, basic_auth: nil, headers: nil)
    act(url, Net::HTTP::Put, JSON.generate(body), basic_auth, headers)
  end

  def delete(url, basic_auth: nil, headers: nil)
    act(url, Net::HTTP::Delete, '', basic_auth, headers)
  end

  private

  def act(url, method, body, basic_auth, headers)
    uri = URI(url)
    req = method.new(uri)
    req.content_type = 'application/json'
    apply_basic_auth req, basic_auth
    apply_headers req, headers if headers
    req.body = body if body
    call uri, req
  end

  def apply_basic_auth(req, basic_auth)
    return if !basic_auth || basic_auth.empty?
    req.basic_auth basic_auth.username, basic_auth.password
  end

  def apply_headers(req, headers)
    headers.each do |k, v|
      req[k] = v
    end
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
      safe_parse_json res.body
    else
      raise RestClientError.new(res.code, res.message, res.body)
    end
  end

  def safe_parse_json(body)
    if !body || body.empty?
      nil
    else
      JSON.parse(body)
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
