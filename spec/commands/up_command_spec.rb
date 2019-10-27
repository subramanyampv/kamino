# frozen_string_literal: true

require "commands/up_command"
require "repo_providers/factory"

RSpec.describe Commands::UpCommand do
  context "only create repo" do
    before(:example) do
      @options = {
        name: "dummy",
        owner: "owner",
        username: "username",
        password: "secret",
        provider: :github
      }

      @command = Commands::UpCommand.new(@options)
    end

    it "should create the repo" do
      create_command = double("create-command")
      expect(Commands::CreateCommand).to receive(:new)
        .with(@options)
        .and_return(create_command)
      expect(create_command).to receive(:run)

      init_command = double("init-command")
      expect(Commands::InitCommand).to receive(:new)
        .with(@options)
        .and_return(init_command)
      expect(init_command).to receive(:run)

      @command.run
    end
  end

  context "create repo and activate travis" do
    before(:example) do
      @options = {
        name: "dummy",
        owner: "owner",
        username: "username",
        password: "secret",
        provider: :github,
        token: "travis-secret"
      }

      @command = Commands::UpCommand.new(@options)
    end

    it "should create repo and activate travis" do
      create_command = double("create-command")
      expect(Commands::CreateCommand).to receive(:new)
        .with(@options)
        .and_return(create_command)
      expect(create_command).to receive(:run)

      init_command = double("init-command")
      expect(Commands::InitCommand).to receive(:new)
        .with(@options)
        .and_return(init_command)
      expect(init_command).to receive(:run)

      activate_command = double("activate-travis")
      expect(Commands::ActivateTravisCommand).to receive(:new)
        .with(@options)
        .and_return(activate_command)
      expect(activate_command).to receive(:run)

      @command.run
    end
  end

  context "create repo and activate bitbucket pipelines" do
    before(:example) do
      @options = {
        name: "dummy",
        owner: "owner",
        username: "username",
        password: "secret",
        provider: :bitbucket
      }

      @command = Commands::UpCommand.new(@options)
    end

    it "should create repo and activate bitbucket pipelines" do
      create_command = double("create-command")
      expect(Commands::CreateCommand).to receive(:new)
        .with(@options)
        .and_return(create_command)
      expect(create_command).to receive(:run)

      init_command = double("init-command")
      expect(Commands::InitCommand).to receive(:new)
        .with(@options)
        .and_return(init_command)
      expect(init_command).to receive(:run)

      activate_command = double("activate-bitbucket-pipelines")
      expect(Commands::ActivateBitbucketPipelinesCommand).to receive(:new)
        .with(@options)
        .and_return(activate_command)
      expect(activate_command).to receive(:run)

      @command.run
    end
  end
end
