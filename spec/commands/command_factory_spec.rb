# frozen_string_literal: true

require 'commands/command_factory'

RSpec.describe Commands do
  describe '#create_command' do
    it 'should create a command with just options' do
      options = {
        command: 'create',
        hello: 'world',
        provider: :github
      }
      command = Commands.create_command(options)
      expect(command).to be_instance_of(Commands::CreateCommand)
    end
  end
end
