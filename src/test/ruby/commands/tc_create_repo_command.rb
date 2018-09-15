# frozen_string_literal: true

require_relative '../../../main/ruby/commands/create_repo_command'
require_relative '../../../main/ruby/repo_providers/factory'
require 'test/unit'
require 'mocha/test_unit'

module Commands
  # Unit tests for CreateRepoCommand
  class TestCreateRepoCommand < Test::Unit::TestCase
    def setup
      options = {
        name: 'dummy'
      }
      factory = mock
      @provider = mock
      RepoProviders::Factory.expects(:new).with(options).returns(factory)
      factory.expects(:create).returns(@provider)

      @command = CreateRepoCommand.new(options)
    end

    def test_repo_exists
      @provider.expects(:repo_exists?).returns(true)
      @command.expects(:puts).with('Repo already exists')
      assert_nil(@command.run)
    end

    def test_repo_does_not_exist
      @provider.expects(:repo_exists?).returns(false)
      @provider.expects(:create_repo).returns('hello')
      assert_equal('hello', @command.run)
    end
  end
end
