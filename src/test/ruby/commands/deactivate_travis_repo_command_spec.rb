# frozen_string_literal: true

require_relative '../../../main/ruby/commands/deactivate_travis_repo_command'

RSpec.describe Commands::DeactivateTravisRepoCommand do
  before(:example) do
    options = {
      name: 'dummy'
    }
    @travis = double('travis')
    expect(TravisFactory).to receive(:create)
      .with(options)
      .and_return(@travis)
    @command = Commands::DeactivateTravisRepoCommand.new(options)
  end

  describe '#run' do
    it 'should deactivate the repo' do
      expect(@travis).to receive(:deactivate_repo)
        .and_return(42)
      expect(@command.run).to eq(42)
    end
  end
end
