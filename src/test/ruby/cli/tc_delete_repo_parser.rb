# frozen_string_literal: true

require_relative '../../../main/ruby/cli/delete_repo_parser'
require 'test/unit'
require 'mocha/test_unit'

module CLI
  # Unit tests for DeleteRepoParser
  class TestDeleteRepoParser < Test::Unit::TestCase
    def setup
      @parser = DeleteRepoParser.new
    end

    def test_name
      assert_equal('delete', @parser.name)
    end

    # rubocop:disable Metrics/MethodLength
    def test_short_options
      argv = [
        '-nrepo',
        '-ongeor',
        '-pgithub',
        '-usecret',
        '--password=redacted'
      ]

      result = @parser.parse(argv)

      assert_equal('repo', result[:name])
      assert_equal('ngeor', result[:owner])
      assert_equal(:github, result[:provider])
      assert_equal('secret', result[:username])
      assert_equal('redacted', result[:password])
    end

    def test_long_options
      argv = [
        '--name',
        'repo',
        '--owner',
        'ngeor',
        '--provider',
        'github',
        '--username',
        'secret',
        '--password',
        'sesame'
      ]

      result = @parser.parse(argv)

      assert_equal('repo', result[:name])
      assert_equal('ngeor', result[:owner])
      assert_equal(:github, result[:provider])
      assert_equal('secret', result[:username])
      assert_equal('sesame', result[:password])
    end
    # rubocop:enable Metrics/MethodLength
  end
end
