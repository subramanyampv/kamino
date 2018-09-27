# frozen_string_literal: true

# Mixin which adds username and password fields.
module BasicAuthMixin
  attr_reader :username
  attr_reader :password
end

# Basic authentication credentials.
class BasicAuth
  def initialize(username, password)
    @username = username
    @password = password
  end

  include BasicAuthMixin

  def empty?
    username.to_s.empty?
  end

  def ==(other)
    username == other.username && password == other.password
  end
end
