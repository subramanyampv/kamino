require_relative 'github'
require_relative 'travis'

puts 'hello, world'
github = Github.new
github.get_repos
#create_repo

travis = Travis.new
#travis.activate_repo 'ngeor', 'instarepo'
