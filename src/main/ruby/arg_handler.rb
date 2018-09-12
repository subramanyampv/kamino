require 'optparse'

# Parses arguments passed directly to the CLI
class ArgHandler
  # rubocop:disable Metrics/BlockLength, Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize, Layout/IndentHeredoc
  def parse(argv)
    options = {}

    help = <<HELP
Available commands:
  create: Creates a new repository
HELP

    global = OptionParser.new do |opts|
      opts.banner = 'Usage: main.rb [global options] [subcommand [options]]'
      opts.separator ''
      opts.separator help
    end

    create_subcommand = OptionParser.new do |opts|
      opts.banner = 'Usage: main.rb [global options] create [options]'
      opts.on('-nNAME', '--name=NAME', 'The name of the repository') do |v|
        options[:name] = v
      end

      opts.on('-oOWNER', '--owner=OWNER', 'The owner of the repository') do |v|
        options[:owner] = v
      end

      opts.on('--description=DESCRIPTION',
              'A short description of the repository') do |v|
        options[:description] = v
      end

      opts.on('-lLANGUAGE', '--language=LANGUAGE',
              'The programming language') do |v|
        options[:language] = v
      end

      opts.on('-pPROVIDER', '--provider=PROVIDER', %i[github bitbucket],
              'Select provider (github, bitbucket)') do |v|
        options[:provider] = v
      end

      opts.on('-uUSERNAME', '--username=USERNAME',
              'The username to connect to the git provider') do |v|
        options[:username] = v
      end

      opts.on('--password=PASSWORD',
              'The password to connect to the git provider') do |v|
        options[:password] = v
      end
    end

    subcommands = {
      create: create_subcommand
    }

    global.order!(argv)
    command = argv.shift
    subcommands[command.to_sym].order!(argv)
    options
  end
  # rubocop:enable Metrics/BlockLength, Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize, Layout/IndentHeredoc
end
