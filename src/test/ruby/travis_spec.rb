# frozen_string_literal: true

require_relative '../../main/ruby/travis'

RSpec.describe Travis do
  before(:example) do
    options = {
      name: 'instarepo',
      owner: 'ngeor',
      token: 'secret'
    }
    @travis = Travis.new(options)
    @travis.rest_client = double('rest_client')
  end

  describe('#activate_repo') do
    it('should activate repo') do
      # arrange
      url = 'https://api.travis-ci.org/repo/ngeor%2Finstarepo/activate'

      headers = {
        'Authorization' => 'token secret',
        'Travis-API-Version' => '3'
      }

      allow(@travis.rest_client).to receive(:post)
        .with(url, '', headers: headers)
        .and_return(test: 42)

      # act
      result = @travis.activate_repo

      # assert
      expect(result).to eq(test: 42)
    end
  end

  describe('#add_badge_to_readme') do
    it('should add the badge when it does not exist') do
      # arrange
      read_file = ['# my repo', 'another line']
      allow(File).to receive(:open)
        .with('C:/tmp/myrepo/README.md')
        .and_return(read_file)

      write_file = double('write_file')
      allow(write_file).to receive(:puts)
        .with("\n[![Build Status]" \
        '(https://travis-ci.org/ngeor/instarepo.svg?branch=master)]' \
        '(https://travis-ci.org/ngeor/instarepo)')
      allow(File).to receive(:open)
        .with('C:/tmp/myrepo/README.md', 'a')
        .and_yield(write_file)

      # act
      result = @travis.add_badge_to_readme('C:/tmp/myrepo')

      # assert
      expect(result).to eq(true)
    end

    it('should not add the badge when it already exists') do
      # arrange
      read_file = [
        '# my repo',
        'another line',
        '[![Build Status](https://travis-ci.org/ngeor/instarepo.svg?branch=master)](https://travis-ci.org/ngeor/instarepo)'
      ]
      allow(File).to receive(:open)
        .with('C:/tmp/myrepo/README.md')
        .and_return(read_file)

      # act
      result = @travis.add_badge_to_readme('C:/tmp/myrepo')

      # assert
      expect(result).to eq(false)
    end
  end
end
