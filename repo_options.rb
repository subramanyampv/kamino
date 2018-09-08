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
