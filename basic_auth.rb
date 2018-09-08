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

  def ==(other)
    username == other.username && password == other.password
  end
end
