require_relative 'github'
require_relative 'git'
require_relative 'travis'

puts 'hello, world'

repo_owner = 'ngeor'
repo_name = 'test'
clone_dir_root = 'C:\tmp'

# create repository
github = Github.new
#github.create_repo repo_name

# clone locally
git = Git.new
# git.clone(github.clone_url(repo_owner, repo_name), clone_dir_root)

#puts "#{File.join(clone_dir_root, repo_name)}"

# activate travis
travis = Travis.new
#travis.activate_repo repo_owner, repo_name
