# frozen_string_literal: true

require_relative '../../../main/ruby/commands/delete_repo_command'

RSpec.describe Commands::DeleteRepoCommand do
  before(:example) do
    options = {
      name: 'dummy'
    }
    @provider = double('provider')
    @command = Commands::DeleteRepoCommand.new(options)
    @command.provider = @provider
  end

  context 'when repo exists' do
    before(:example) do
      allow(@provider).to receive(:repo_exists?).and_return(true)
    end

    it 'should delete the repo' do
      allow(@provider).to receive(:delete_repo).and_return('hello')
      expect(@command.run).to eq('hello')
    end
  end

  context 'when repo does not exist' do
    before(:example) do
      allow(@provider).to receive(:repo_exists?).and_return(false)
    end

    it 'should not delete the repo' do
      expect(@command).to receive(:puts).with('Repo does not exist')
      expect(@command.run).to be_nil
    end
  end
end
