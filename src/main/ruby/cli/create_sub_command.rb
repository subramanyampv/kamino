require 'optparse'

module CLI
  # CLI sub-command that creates a new repository.
  class CreateSubCommand
    def name
      'create'
    end

    # rubocop:disable Metrics/BlockLength, Metrics/MethodLength
    def order!(options, argv)
      option_parser = OptionParser.new do |opts|
        opts.banner = 'Usage: main.rb [global options] create [options]'
        opts.on('-nNAME', '--name=NAME', 'The name of the repository') do |v|
          options[:name] = v
        end

        opts.on('-oOWNER', '--owner=OWNER',
                'The owner of the repository') do |v|
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

      option_parser.order!(argv)
      options
    end
    # rubocop:enable Metrics/BlockLength, Metrics/MethodLength
  end
end
