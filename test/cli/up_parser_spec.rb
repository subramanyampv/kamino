# frozen_string_literal: true

require 'cli/up_parser'

RSpec.describe CLI::UpParser do
  before(:example) do
    @parser = CLI::UpParser.new
  end

  describe '#parse' do
    it 'should work with short options' do
      argv = [
        '-nrepo',
        '-ongeor',
        '-pgithub',
        '-usecret',
        '--password=redacted',
        '--description=my cool repo',
        '-ljava',
        '--clone-dir=..'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'redacted',
        description: 'my cool repo',
        language: 'java',
        clone_dir: '..'
      )
    end

    it 'should work with long options' do
      argv = [
        '--name',
        'repo',
        '--owner',
        'ngeor',
        '--provider',
        'github',
        '--username',
        'secret',
        '--password',
        'sesame',
        '--description',
        'my awesome repo',
        '--language',
        'java',
        '--clone-dir',
        '../'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'sesame',
        description: 'my awesome repo',
        language: 'java',
        clone_dir: '../'
      )
    end

    it 'should work with optional options' do
      argv = [
        '--name',
        'repo',
        '--owner',
        'ngeor',
        '--provider',
        'github',
        '--username',
        'secret',
        '--password',
        'sesame',
        '--description=my cool repo',
        '-ljava',
        '--clone-dir=..',
        '-ttravis',
        '--travis-badge'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'sesame',
        description: 'my cool repo',
        language: 'java',
        clone_dir: '..',
        token: 'travis',
        travis_badge: true
      )
    end
  end
end
