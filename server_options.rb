class ServerOptions
  # GitHub or Bitbucket
  attr_accessor :provider
  attr_accessor :username
  attr_accessor :password

  def to_s
    "#{self.class.name} {provider: #{provider}, " \
      "username: #{username}, password: #{password}}"
  end
end
