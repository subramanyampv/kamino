# frozen_string_literal: true

require_relative '../../../main/ruby/commands/init_repo_command'
require_relative '../../../main/ruby/repo_providers/factory'
require_relative '../../../main/ruby/git'

RSpec.describe Commands::InitRepoCommand do
  before(:example) do
    options = {
      name: 'dummy',
      clone_dir: 'C:/tmp'
    }

    factory = double('factory')
    expect(RepoProviders::Factory).to receive(:new)
      .with(options)
      .and_return(factory)

    @provider = double('provider')
    allow(factory).to receive(:create).and_return(@provider)

    @command = Commands::InitRepoCommand.new(options)
  end

  context 'when repo exists' do
    before(:example) do
      allow(@provider).to receive(:repo_exists?).and_return(true)
      allow(@provider).to receive(:clone_url).and_return('ssh://host')

      @git = double('git')
      allow(Git).to receive(:new)
        .with('ssh://host', 'dummy', 'C:/tmp')
        .and_return(@git)

      allow(@git).to receive(:clone_or_pull).and_return(42)
      allow(@git).to receive(:working_dir).and_return('C:/tmp/dummy')
    end

    context 'when README exists' do
      before(:example) do
        allow(File).to receive(:file?)
          .with('C:/tmp/dummy/README.md')
          .and_return(true)
      end

      it 'should initialize the repo' do
        expect(@command.run).to be true
      end
    end

    context 'when README does not exist' do
      before(:example) do
        allow(File).to receive(:file?)
          .with('C:/tmp/dummy/README.md')
          .and_return(false)
      end

      it 'should initialize the repo' do
        expect(@command.run).to be true
      end
    end
  end

  context 'when repo does not exist' do
    before(:example) do
      allow(@provider).to receive(:repo_exists?).and_return(false)
    end

    it 'should not initialize the repo' do
      expect(@command).to receive(:puts).with('Repo does not exist')
      expect(@command.run).to be false
    end
  end
end
