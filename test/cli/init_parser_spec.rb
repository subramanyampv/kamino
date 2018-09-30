# frozen_string_literal: true

require 'cli/init_parser'

RSpec.describe CLI::InitParser do
  before(:example) do
    @parser = CLI::InitParser.new
  end

  describe '#parse' do
    it 'should work with short options' do
      argv = [
        '-nrepo',
        '-ongeor',
        '-pgithub',
        '-usecret',
        '--password=redacted',
        '-ljava',
        '--description=fancy repo',
        '--clone-dir=C:/tmp'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'redacted',
        language: 'java',
        description: 'fancy repo',
        clone_dir: 'C:/tmp'
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
        '--language',
        'pascal',
        '--description',
        'fancy repo',
        '--clone-dir',
        'C:/tmp'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'sesame',
        language: 'pascal',
        description: 'fancy repo',
        clone_dir: 'C:/tmp'
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
        '--language',
        'pascal',
        '--description',
        'fancy repo',
        '--clone-dir',
        'C:/tmp',
        '--travis-badge'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'sesame',
        language: 'pascal',
        description: 'fancy repo',
        clone_dir: 'C:/tmp',
        travis_badge: true
      )
    end
  end
end
