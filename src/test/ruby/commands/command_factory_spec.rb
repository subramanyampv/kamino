# frozen_string_literal: true

require_relative '../../../main/ruby/commands/command_factory'

# Dummy command which only accepts options
class CommandWithOptions
  def initialize(options)
    @options = options
  end

  attr_reader :options
end

# Dummy command which accepts a file system
class CommandWithFileSystem < CommandWithOptions
  attr_accessor :file_system
end

# Dummy command which accepts travis
class CommandWithTravis < CommandWithOptions
  attr_accessor :travis
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

    it 'should create a command with file system' do
      options = {
        command: :dummy,
        hello: 'world'
      }

      fs_factory = double('fs_factory')
      allow(FileSystemFactory).to receive(:new)
        .and_return(fs_factory)

      file_system = double('file_system')
      allow(fs_factory).to receive(:create)
        .with(dry_run: false)
        .and_return(file_system)

      factory = Commands::CommandFactory.new(dummy: CommandWithFileSystem)
      command = factory.create_command(options)
      expect(command).to be_instance_of(CommandWithFileSystem)
      expect(command.options).to eq(options)
      expect(command.file_system).to eq(file_system)
    end

    it 'should create a command with file system in dry run mode' do
      options = {
        command: :dummy,
        hello: 'world',
        dry_run: true
      }

      fs_factory = double('fs_factory')
      allow(FileSystemFactory).to receive(:new)
        .and_return(fs_factory)

      file_system = double('file_system')
      allow(fs_factory).to receive(:create)
        .with(dry_run: true)
        .and_return(file_system)

      factory = Commands::CommandFactory.new(dummy: CommandWithFileSystem)
      command = factory.create_command(options)
      expect(command).to be_instance_of(CommandWithFileSystem)
      expect(command.options).to eq(options)
      expect(command.file_system).to eq(file_system)
    end

    it 'should create a command with travis' do
      options = {
        command: :dummy,
        hello: 'world'
      }

      travis_factory = double('travis_factory')
      allow(TravisFactory).to receive(:new)
        .and_return(travis_factory)

      travis = double('travis')
      allow(travis_factory).to receive(:create)
        .with(options)
        .and_return(travis)

      factory = Commands::CommandFactory.new(dummy: CommandWithTravis)
      command = factory.create_command(options)
      expect(command).to be_instance_of(CommandWithTravis)
      expect(command.options).to eq(options)
      expect(command.travis).to eq(travis)
    end
  end
end
