# frozen_string_literal: true

require_relative '../../../main/ruby/cli/delete_repo_parser'

RSpec.describe CLI::DeleteRepoParser do
  before(:example) do
    @parser = CLI::DeleteRepoParser.new
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
  end
end
