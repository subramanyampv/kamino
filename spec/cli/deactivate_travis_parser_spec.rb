# frozen_string_literal: true

require 'cli/deactivate_travis_parser'

RSpec.describe CLI::DeactivateTravisParser do
  before(:example) do
    @parser = CLI::DeactivateTravisParser.new
  end

  describe '#parse' do
    it 'should work with short options' do
      argv = [
        '-nrepo',
        '-ongeor',
        '-ttoken'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        token: 'token'
      )
    end

    it 'should work with long options' do
      argv = [
        '--name',
        'repo',
        '--owner',
        'ngeor',
        '--token',
        'secret'
      ]

      result = @parser.parse(argv)

      expect(result).to eq(
        name: 'repo',
        owner: 'ngeor',
        token: 'secret'
      )
    end
  end
end
