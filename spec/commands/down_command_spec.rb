# frozen_string_literal: true

require "commands/down_command"
require "repo_providers/factory"

RSpec.describe Commands::DownCommand do
  context "only delete repo" do
    before(:example) do
      @options = {
        name: "dummy",
        owner: "owner",
        username: "username",
        password: "secret",
        provider: :github
      }

      @command = Commands::DownCommand.new(@options)
    end

    it "should delete the repo" do
      delete_command = double("delete-command")
      expect(Commands::DeleteCommand).to receive(:new)
        .with(@options)
        .and_return(delete_command)
      expect(delete_command).to receive(:run)

      @command.run
    end
  end

  context "deactivate travis and delete repo" do
    before(:example) do
      @options = {
        name: "dummy",
        owner: "owner",
        username: "username",
        password: "secret",
        provider: :github,
        token: "travis-secret"
      }

      @command = Commands::DownCommand.new(@options)
    end

    it "should deactivate travis and delete the repo" do
      deactivate_command = double("deactivate-travis")
      expect(Commands::DeactivateTravisCommand).to receive(:new)
        .with(@options)
        .and_return(deactivate_command)
      expect(deactivate_command).to receive(:run)

      delete_command = double("delete-command")
      expect(Commands::DeleteCommand).to receive(:new)
        .with(@options)
        .and_return(delete_command)
      expect(delete_command).to receive(:run)

      @command.run
    end
  end

  context "deactivate bitbucket pipelines and delete repo" do
    before(:example) do
      @options = {
        name: "dummy",
        owner: "owner",
        username: "username",
        password: "secret",
        provider: :bitbucket
      }

      @command = Commands::DownCommand.new(@options)
    end

    it "should deactivate bitbucket pipelines and delete the repo" do
      deactivate_command = double("deactivate-bitbucket-pipelines")
      expect(Commands::DeactivateBitbucketPipelinesCommand).to receive(:new)
        .with(@options)
        .and_return(deactivate_command)
      expect(deactivate_command).to receive(:run)

      delete_command = double("delete-command")
      expect(Commands::DeleteCommand).to receive(:new)
        .with(@options)
        .and_return(delete_command)
      expect(delete_command).to receive(:run)

      @command.run
    end
  end
end
