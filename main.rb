require_relative 'bitbucket'
require_relative 'github'
require_relative 'git'
require_relative 'travis'
require_relative 'repo_options'
require_relative 'server_options'

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

def create_provider(repo_options, server_options)
  case server_options.provider
  when 'GitHub'
    GitHub.new(repo_options, server_options)
  when 'Bitbucket'
    Bitbucket.new(repo_options, server_options)
  else
    raise "Unsupported provider #{server_options.provider}"
  end
end

def safe_clone(clone_url, repo_name, clone_dir_root)
  raise "Directory #{clone_dir_root} does not exist" unless \
    Dir.exist?(clone_dir_root)
  work_dir = File.join(clone_dir_root, repo_name)
  raise "Directory #{work_dir} already exists" if Dir.exist?(work_dir)
  git = Git.new
  raise 'Could not clone' unless git.clone(clone_url, clone_dir_root)
end

# Interactive flow
# rubocop:disable Metrics/AbcSize, Metrics/MethodLength
def interactive
  repo_options = RepoOptions.new
  server_options = ServerOptions.new

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

    puts repo_options
    puts server_options

    provider = create_provider(repo_options, server_options)

    if provider.repo_exists?
      # it's ok
      puts "Repo #{repo_options.name} already exists."
    else
      # create it!
      puts "Creating repo #{repo_options.name}..."
      provider.create_repo
    end

    clone_dir_root = read_string(
      'In which directory should the repo be cloned?'
    )

    use_ssh = read_yes_no('Should we use SSH')

    # TODO: clone or pull if git remote match
    safe_clone provider.clone_url(use_ssh), repo_options.name, clone_dir_root
  when 'N'
    puts 'Ok, skipping creation.'
  end
end
# rubocop:enable Metrics/AbcSize, Metrics/MethodLength

interactive if $PROGRAM_NAME == __FILE__
