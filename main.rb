require_relative 'github'
require_relative 'git'
require_relative 'travis'

puts 'hello, world'

def repo_owner
  'ngeor'
end

def repo_name
  'test'
end

def clone_dir_root
  'C:\tmp'
end

def work_dir
  File.join(clone_dir_root, repo_name)
end

def create_repo
  # create repository
  github = Github.new
  #github.create_repo repo_name
end

def clone
  # clone locally
  git = Git.new
  # git.clone(github.clone_url(repo_owner, repo_name), clone_dir_root)
end

def activate_travis
  # activate travis
  travis = Travis.new(repo_owner, repo_name)
  #travis.activate_repo repo_owner, repo_name
end

def add_travis_badge
  travis = Travis.new(repo_owner, repo_name)
  travis.add_badge_to_readme(work_dir)
end

create_repo
clone
activate_travis
add_travis_badge
