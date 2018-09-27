# frozen_string_literal: true

require_relative '../../../main/ruby/commands/command_factory'

# Dummy command which only accepts options
class CommandWithOptions
  def initialize(options)
    @options = options
  end

  attr_reader :options
end

RSpec.describe Commands::CommandFactory do
  describe '#create_command' do
    it 'should create a command with just options' do
      factory = Commands::CommandFactory.new(dummy: CommandWithOptions)
      options = {
        command: :dummy,
        hello: 'world'
      }
      command = factory.create_command(options)
      expect(command).to be_instance_of(CommandWithOptions)
      expect(command.options).to eq(options)
    end
  end
end
