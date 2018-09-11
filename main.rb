require_relative 'arg_handler'
require_relative 'bitbucket'
require_relative 'github'
require_relative 'git'
require_relative 'travis'

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

def create_provider(options)
  case options[:provider]
  when :github
    GitHub.new(options)
  when :bitbucket
    Bitbucket.new(options)
  else
    raise "Unsupported provider #{options[:provider]}"
  end
end

# Interactive flow
# rubocop:disable Metrics/AbcSize, Metrics/MethodLength
# rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
def interactive(options)
  puts 'Welcome to instarepo!'
  case read_yes_no('Would you like to create a new repository')
  when 'Y'
    options[:name] ||= read_string('What should the repo name be?')
    options[:description] ||= read_string(
      'What is the repo about? Describe it in a short sentence.'
    )
    options[:owner] ||= read_string(
      'Who is the owner of the repository?'
    )
    options[:language] ||= read_option(
      'What is the programming language?',
      %w[Java]
    )
    options[:provider] ||= read_option(
      'Where should the repo be hosted?',
      %w[GitHub Bitbucket]
    )
    options[:username] ||= read_string('What is the username?')
    options[:password] ||= read_string('What is the password?')

    puts options

    provider = create_provider(options)

    if provider.repo_exists?
      # it's ok
      puts "Repo #{options[:name]} already exists."
    else
      # create it!
      puts "Creating repo #{options[:name]}..."
      provider.create_repo
    end

    options[:clone_dir_root] = read_string(
      'In which directory should the repo be cloned?'
    )

    options[:use_ssh] = read_yes_no('Should we use SSH')

    git = Git.new(
      provider.clone_url(options[:use_ssh]),
      options[:name],
      options[:clone_dir_root]
    )

    git.clone_or_pull

    options[:use_travis] = options[:provider] == :github && \
                           read_yes_no('Would you like to use Travis')
    options[:use_bitbucket_pipelines] = \
      server_options.provider == :bitbucket && \
      read_yes_no('Would you like to enable Bitbucket Pipelines')

    if options[:use_travis]
      options[:token] = read_string('What is your Travis token?')
      travis = Travis.new(options)
      travis.activate_repo

      travis.add_badge_to_readme(git.working_dir)
      git.add 'README.md'
      git.commit 'Added Travis badge in README.md'
      git.push
    end

    if options[:use_bitbucket_pipelines]
      # TODO: enable bitbucket pipelines
    end
  when 'N'
    puts 'Ok, skipping creation.'
  end
end
# rubocop:enable Metrics/AbcSize, Metrics/MethodLength
# rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

# entrypoint for the program
def main
  arg_handler = ArgHandler.new
  options = arg_handler.parse(ARGV)
  interactive options
end

main if $PROGRAM_NAME == __FILE__
