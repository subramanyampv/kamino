# frozen_string_literal: true

require 'travis'

RSpec.describe Travis do
  before(:example) do
    @rest_client = double('rest_client')
    expect(RestClient).to receive(:new).and_return(@rest_client)

    @file_system = double('file_system')
    expect(FileSystem).to receive(:new).and_return(@file_system)

    @travis = Travis.new
    @travis.name = 'instarepo'
    @travis.owner = 'ngeor'
    @travis.token = 'secret'
  end

  describe('#activate_repo') do
    it('should activate repo') do
      # arrange
      url = 'https://api.travis-ci.org/repo/ngeor%2Finstarepo/activate'

      headers = {
        'Authorization' => 'token secret',
        'Travis-API-Version' => '3'
      }

      allow(@rest_client).to receive(:post)
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
      badge = '[![Build Status]' \
      '(https://travis-ci.org/ngeor/instarepo.svg?branch=master)]' \
      '(https://travis-ci.org/ngeor/instarepo)'
      allow(@file_system).to receive(:line_exist?)
        .with('C:/tmp/myrepo/README.md', badge)
        .and_return(false)

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
      badge = '[![Build Status]' \
      '(https://travis-ci.org/ngeor/instarepo.svg?branch=master)]' \
      '(https://travis-ci.org/ngeor/instarepo)'
      allow(@file_system).to receive(:line_exist?)
        .with('C:/tmp/myrepo/README.md', badge)
        .and_return(true)

      # act
      result = @travis.add_badge_to_readme('C:/tmp/myrepo')

      # assert
      expect(result).to eq(false)
    end
  end
end

RSpec.describe DryRunTravis do
  before(:example) do
    @travis = DryRunTravis.new(Travis.new)
  end

  describe '#activate_repo' do
    it 'should only print' do
      expect(@travis).to receive(:puts)
        .with('Would have activated repo in Travis')
      @travis.activate_repo
    end
  end

  describe '#deactivate_repo' do
    it 'should only print' do
      expect(@travis).to receive(:puts)
        .with('Would have deactivated repo in Travis')
      @travis.deactivate_repo
    end
  end
end

RSpec.describe TravisFactory do
  describe '#create' do
    it 'should create real' do
      travis = TravisFactory.create(owner: 'ngeor')
      expect(travis).to be_instance_of(Travis)
    end

    it 'should create dry-run' do
      travis = TravisFactory.create(owner: 'ngeor', dry_run: true)
      expect(travis).to be_instance_of(DryRunTravis)
      expect(travis.__getobj__).to be_instance_of(Travis)
    end
  end
end
