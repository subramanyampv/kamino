# frozen_string_literal: true

require 'commands/deactivate_travis_command'

RSpec.describe Commands::DeactivateTravisCommand do
  before(:example) do
    options = {
      name: 'dummy'
    }
    @travis = double('travis')
    expect(TravisFactory).to receive(:create)
      .with(options)
      .and_return(@travis)
    @command = Commands::DeactivateTravisCommand.new(options)
  end

  describe '#run' do
    it 'should deactivate the repo' do
      expect(@travis).to receive(:sync).ordered
      expect(@travis).to receive(:deactivate_repo)
        .ordered
        .and_return(42)
      expect(@command.run).to eq(42)
    end
  end
end
