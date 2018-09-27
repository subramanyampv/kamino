# frozen_string_literal: true

require_relative '../../../main/ruby/cli/init_repo_parser'

RSpec.describe CLI::InitRepoParser do
  before(:example) do
    @parser = CLI::InitRepoParser.new
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
  end
end
