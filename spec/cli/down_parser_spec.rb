# frozen_string_literal: true

require 'cli/down_parser'

RSpec.describe CLI::DownParser do
  before(:example) do
    @parser = CLI::DownParser.new
  end

  describe '#parse' do
    it 'should work with short options' do
      argv = [
        '-nrepo',
        '-ongeor',
        '-pgithub',
        '-usecret',
        '--password=redacted'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'redacted'
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
        'sesame'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'sesame'
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
        '-ttravis'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        provider: :github,
        username: 'secret',
        password: 'sesame',
        token: 'travis'
      )
    end
  end
end
