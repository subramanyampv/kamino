# frozen_string_literal: true

require_relative '../../../main/ruby/commands/delete_repo_command'
require_relative '../../../main/ruby/repo_providers/factory'
require 'test/unit'
require 'mocha/test_unit'

module Commands
  # Unit tests for DeleteRepoCommand
  class TestDeleteRepoCommand < Test::Unit::TestCase
    def setup
      options = {
        name: 'dummy'
      }
      factory = mock
      @provider = mock
      RepoProviders::Factory.expects(:new).with(options).returns(factory)
      factory.expects(:create).returns(@provider)

      @command = DeleteRepoCommand.new(options)
    end

    def test_repo_exists
      @provider.expects(:repo_exists?).returns(true)
      @provider.expects(:delete_repo).returns('hello')
      assert_equal('hello', @command.run)
    end

    def test_repo_does_not_exist
      @provider.expects(:repo_exists?).returns(false)
      @command.expects(:puts).with('Repo does not exist')
      assert_nil(@command.run)
    end
  end
end
