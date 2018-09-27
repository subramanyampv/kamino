# frozen_string_literal: true

require_relative '../../../main/ruby/commands/activate_travis_repo_command'

RSpec.describe Commands::ActivateTravisRepoCommand do
  before(:example) do
    options = {
      name: 'dummy'
    }
    @travis = double('travis')
    expect(TravisFactory).to receive(:create)
      .with(options)
      .and_return(@travis)
    @command = Commands::ActivateTravisRepoCommand.new(options)
  end

  describe '#run' do
    it 'should activate the repo' do
      expect(@travis).to receive(:activate_repo)
        .and_return(42)
      expect(@command.run).to eq(42)
    end
  end
end
