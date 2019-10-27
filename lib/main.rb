# frozen_string_literal: true

require "thor"

require_relative "commands/activate_bitbucket_pipelines_command"
require_relative "commands/activate_travis_command"
require_relative "commands/create_command"
require_relative "commands/deactivate_bitbucket_pipelines_command"
require_relative "commands/deactivate_travis_command"
require_relative "commands/delete_command"
require_relative "commands/down_command"
require_relative "commands/init_command"
require_relative "commands/up_command"

# CLI built with Thor. Parses CLI arguments and calls commands.
class MyApp < Thor
  desc "activate-bitbucket-pipelines", "Activates Bitbucket Pipelines for a private Bitbucket Cloud repository, allowing it to run builds"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :username, type: :string, required: true, desc: "Username for accessing Bitbucket API"
  method_option :password, type: :string, required: true, desc: "Password for accessing Bitbucket API"
  def activate_bitbucket_pipelines
    Commands::ActivateBitbucketPipelinesCommand.new(options).run
  end

  desc "activate-travis", "Activates Travis CI for a public GitHub repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :token, type: :string, required: true, desc: "The Travis token"
  def activate_travis
    Commands::ActivateTravisCommand.new(options).run
  end

  desc "create", "Creates a new git repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :description, type: :string, required: true, desc: "The description of the repository"
  method_option :language, type: :string, required: true, desc: "The programming language of the repository"
  method_option :provider, type: :string, required: true, enum: %w[github bitbucket], desc: "The repository provider"
  method_option :username, type: :string, required: true, desc: "Username for accessing repository provider API"
  method_option :password, type: :string, required: true, desc: "Password for accessing repository provider API"
  def create
    Commands::CreateCommand.new(options).run
  end

  desc "deactivate-bitbucket-pipelines", "Deactivates Bitbucket Pipelines for a private Bitbucket Cloud repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :username, type: :string, required: true, desc: "Username for accessing Bitbucket API"
  method_option :password, type: :string, required: true, desc: "Password for accessing Bitbucket API"
  def deactivate_bitbucket_pipelines
    Commands::DeactivateBitbucketPipelinesCommand.new(options).run
  end

  desc "deactivate-travis", "Deactivates Travis CI for a public GitHub repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :token, type: :string, required: true, desc: "The Travis token"
  def deactivate_travis
    Commands::DeactivateTravisCommand.new(options).run
  end

  desc "delete", "Deletes an existing git repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :provider, type: :string, required: true, enum: %w[github bitbucket], desc: "The repository provider"
  method_option :username, type: :string, required: true, desc: "Username for accessing repository provider API"
  method_option :password, type: :string, required: true, desc: "Password for accessing repository provider API"
  def delete
    Commands::DeleteCommand.new(options).run
  end

  desc "down", "Deactivates CI and deletes an existing git repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :provider, type: :string, required: true, enum: %w[github bitbucket], desc: "The repository provider"
  method_option :username, type: :string, required: true, desc: "Username for accessing repository provider API"
  method_option :password, type: :string, required: true, desc: "Password for accessing repository provider API"
  method_option :token, type: :string, required: true, desc: "The Travis token"
  def down
    Commands::DownCommand.new(options).run
  end

  desc "init", "Initializes an existing git repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :description, type: :string, required: true, desc: "The description of the repository"
  method_option :language, type: :string, required: true, desc: "The programming language of the repository"
  method_option :provider, type: :string, required: true, enum: %w[github bitbucket], desc: "The repository provider"
  method_option :username, type: :string, required: true, desc: "Username for accessing repository provider API"
  method_option :password, type: :string, required: true, desc: "Password for accessing repository provider API"
  method_option :clone_dir, type: :string, required: true, desc: "Local directory where the repository should be cloned"
  method_option :travis_badge, type: :boolean, desc: "Add Travis Badge in the README.md file"
  def init
    Commands::InitCommand.new(options).run
  end

  desc "up", "Creates and initializes an existing git repository"
  method_option :name, type: :string, required: true, desc: "The name of the repository"
  method_option :owner, type: :string, required: true, desc: "The owner of the repository"
  method_option :description, type: :string, required: true, desc: "The description of the repository"
  method_option :language, type: :string, required: true, desc: "The programming language of the repository"
  method_option :provider, type: :string, required: true, enum: %w[github bitbucket], desc: "The repository provider"
  method_option :username, type: :string, required: true, desc: "Username for accessing repository provider API"
  method_option :password, type: :string, required: true, desc: "Password for accessing repository provider API"
  method_option :clone_dir, type: :string, required: true, desc: "Local directory where the repository should be cloned"
  method_option :travis_badge, type: :boolean, desc: "Add Travis Badge in the README.md file"
  def up
    Commands::UpCommand.new(options).run
  end
end

MyApp.start if $PROGRAM_NAME == __FILE__
