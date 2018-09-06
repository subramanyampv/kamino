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

class RepoOptions
  attr_accessor :name
  attr_accessor :owner
  attr_accessor :description
  attr_accessor :language

  def to_s
    "#{self.class.name} {name: #{name}, owner: #{owner}, " \
      "language: #{language}, description: #{description}}"
  end
end
