# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/factory'
require_relative '../../../main/ruby/repo_providers/github'
require_relative '../../../main/ruby/repo_providers/bitbucket'
require 'test/unit'
require 'mocha/test_unit'

module RepoProviders
  # Unit tests for Factory
  class TestFactory < Test::Unit::TestCase
    def test_github
      factory = Factory.new(provider: :github)
      provider = factory.create
      assert_equal(GitHub, provider.class)
    end

    def test_bitbucket
      factory = Factory.new(provider: :bitbucket)
      provider = factory.create
      assert_equal(Bitbucket, provider.class)
    end

    def test_unknown
      factory = Factory.new(provider: :sourceforge)
      assert_raise_message 'Unsupported provider sourceforge' do
        factory.create
      end
    end

    def test_github_dry_run
      factory = Factory.new(provider: :github, dry_run: true)
      provider = factory.create
      assert_equal(DryRunProviderDecorator, provider.class)
      assert_equal(GitHub, provider.__getobj__.class)
    end
  end
end
