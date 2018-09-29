# frozen_string_literal: true

require_relative '../../../main/ruby/cli/activate_bitbucket_pipelines_parser'

RSpec.describe CLI::ActivateBitbucketPipelinesParser do
  before(:example) do
    @parser = CLI::ActivateBitbucketPipelinesParser.new
  end

  describe '#parse' do
    it 'should work with short options' do
      argv = [
        '-nrepo',
        '-ongeor',
        '-uusername',
        '--password',
        'secret'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        username: 'username',
        password: 'secret'
      )
    end

    it 'should work with long options' do
      argv = [
        '--name',
        'repo',
        '--owner',
        'ngeor',
        '--username',
        'user123',
        '--password',
        'redacted'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        username: 'user123',
        password: 'redacted'
      )
    end
  end
end
