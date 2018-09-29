# frozen_string_literal: true

require_relative '../../../main/ruby/commands/create_command'
require_relative '../../../main/ruby/repo_providers/factory'

RSpec.describe Commands::CreateCommand do
  before(:example) do
    options = {
      name: 'dummy',
      description: 'super duper repo'
    }
    @provider = double('provider')
    expect(RepoProviders).to receive(:create)
      .with(options)
      .and_return(@provider)
    @command = Commands::CreateCommand.new(options)
  end

  context 'when repo exists' do
    before(:example) do
      allow(@provider).to receive(:repo_exists?).and_return(true)
    end

    it 'should not create the repo' do
      expect(@command).to receive(:puts).with('Repo already exists')
      expect(@command.run).to be_nil
    end
  end

  context 'when repo does not exist' do
    before(:example) do
      allow(@provider).to receive(:repo_exists?).and_return(false)
    end

    it 'should create the repo' do
      allow(@provider).to receive(:create_repo)
        .with(description: 'super duper repo')
        .and_return('hello')
      expect(@command.run).to eq('hello')
    end
  end
end
