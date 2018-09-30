# frozen_string_literal: true

require 'cli/create_parser'

RSpec.describe CLI::CreateParser do
  before(:example) do
    @parser = CLI::CreateParser.new
  end

  describe '#parse' do
    it 'should work with short options' do
      argv = [
        '-nrepo',
        '-ongeor',
        '-ljava',
        '-pgithub',
        '-usecret',
        '--password=redacted'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        language: 'java',
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
        '--language',
        'java',
        '--provider',
        'github',
        '--username',
        'secret',
        '--password',
        'sesame',
        '--description',
        'some fancy repo'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        language: 'java',
        provider: :github,
        username: 'secret',
        password: 'sesame',
        description: 'some fancy repo'
      )
    end
  end
end
