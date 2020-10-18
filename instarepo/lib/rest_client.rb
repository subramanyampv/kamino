# frozen_string_literal: true

require "json"
require "net/http"

class JsonResponseHandler
  class << self
    def handle_response(res)
      case res
      when Net::HTTPSuccess
        safe_parse_json res.body
      else
        raise RestClientError.new(res.code, res.message, res.body)
      end
    end

    private

    def safe_parse_json(body)
      if !body || body.empty?
        nil
      else
        JSON.parse(body)
      end
    end
  end
end

# Utility class to simplify REST calls
class RestClient
  def get(url, basic_auth: nil, headers: nil, response_handler: JsonResponseHandler)
    act(url, Net::HTTP::Get, nil, basic_auth, headers, response_handler)
  end

  def post(url, body, basic_auth: nil, headers: nil, response_handler: JsonResponseHandler)
    act(url, Net::HTTP::Post, json(body), basic_auth, headers, response_handler)
  end

  def put(url, body, basic_auth: nil, headers: nil, response_handler: JsonResponseHandler)
    act(url, Net::HTTP::Put, json(body), basic_auth, headers, response_handler)
  end

  def delete(url, basic_auth: nil, headers: nil, response_handler: JsonResponseHandler)
    act(url, Net::HTTP::Delete, "", basic_auth, headers, response_handler)
  end

  private

  def json(body)
    JSON.generate(body) if body && !body.empty?
  end

  def act(url, method, body, basic_auth, headers, response_handler)
    uri = URI(url)
    req = method.new(uri)
    apply_basic_auth req, basic_auth
    apply_headers req, headers if headers
    req.body = body if body
    call uri, req, response_handler
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

  def call(uri, req, response_handler)
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    response_handler.handle_response(res)
  end
end

# An error that is thrown when the RestClient gets a non-successful code.
class RestClientError < StandardError
  def initialize(code, response_message, body)
    @code = code
    @response_message = response_message
    @body = body
    super("#{@code} - #{@response_message} - #{@body}")
  end

  attr_reader :code

  # Not using :message to avoid overriding the base message
  attr_reader :response_message
  attr_reader :body
end
