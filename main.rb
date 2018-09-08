require_relative 'bitbucket'
require_relative 'github'
require_relative 'git'
require_relative 'travis'
require_relative 'repo_options'
require_relative 'server_options'

def repo_owner
  'ngeor'
end

def repo_name
  'test'
end

def clone_dir_root
  'C:\tmp'
end

# The local working directory of the cloned repository.
def work_dir
  File.join(clone_dir_root, repo_name)
end

def create_repo
  # create repository
  # github = GitHub.new
  # github.create_repo repo_name
  bitbucket = Bitbucket.new
  # bitbucket.delete_repo repo_owner, repo_name
  bitbucket.create_repo repo_owner, repo_name
end

def clone
  # clone locally
  git = Git.new
  git.clone(github.clone_url(repo_owner, repo_name), clone_dir_root)
end

def activate_travis
  # activate travis
  travis = Travis.new(repo_owner, repo_name)
  travis.activate_repo repo_owner, repo_name
end

def add_travis_badge
  travis = Travis.new(repo_owner, repo_name)
  travis.add_badge_to_readme(work_dir)

  git = GitWorkingDirectory.new(work_dir)
  git.add 'README.md'
  git.commit 'Added Travis badge in README.md'
  git.push
end

# Read a yes/no answer from the CLI.
def read_yes_no(prompt)
  answer = ''
  loop do
    puts "#{prompt} (y/n)?"
    answer = gets.strip.upcase
    break if %w[Y N].include?(answer)
    puts 'Sorry, I did not understand you. Please answer with y or n.'
  end

  answer
end

# Read a non-empty string from the CLI.
def read_string(prompt)
  answer = ''
  while answer.empty?
    puts prompt
    answer = gets.strip
    puts 'Sorry, I did not understand you. Please try again.' if answer.empty?
  end

  answer
end

# Read a string from the CLI, constraint to the given options.
def read_option(prompt, options)
  answer = ''
  until options.include?(answer)
    puts "#{prompt} #{options}"
    answer = gets.strip
    unless options.include?(answer)
      puts "Sorry, I did not understand you. Please pick one of #{options}"
    end
  end
  answer
end

# Interactive flow
# rubocop:disable Metrics/AbcSize, Metrics/MethodLength
def interactive
  puts 'Welcome to instarepo!'
  case read_yes_no('Would you like to create a new repository')
  when 'Y'
    repo_options.name = read_string('What should the repo name be?')
    repo_options.description = read_string(
      'What is the repo about? Describe it in a short sentence.'
    )
    repo_options.owner = read_string(
      'Who is the owner of the repository?'
    )
    repo_options.language = read_option(
      'What is the programming language?',
      %w[Java]
    )
    server_options.provider = read_option(
      'Where should the repo be hosted?',
      %w[GitHub Bitbucket]
    )
    server_options.username = read_string('What is the username?')
    server_options.password = read_string('What is the password?')

    puts "Creating repo #{repo_options.name}..."
    puts repo_options
    puts server_options
  when 'N'
    puts 'Ok, skipping creation.'
  end
end
# rubocop:enable Metrics/AbcSize, Metrics/MethodLength

# create_repo
# clone
# activate_travis
# add_travis_badge
