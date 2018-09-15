require_relative '../../../main/ruby/cli/create_repo_parser'
require 'test/unit'
require 'mocha/test_unit'

module CLI
  # Unit tests for CreateRepoParser
  class TestCreateRepoParser < Test::Unit::TestCase
    def setup
      @parser = CreateRepoParser.new
    end

    def test_name
      assert_equal('create', @parser.name)
    end

    # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    def test_short_options
      argv = [
        '-nrepo',
        '-ongeor',
        '-ljava',
        '-pgithub',
        '-usecret',
        '--password=redacted'
      ]

      result = @parser.parse(argv)

      assert_equal('repo', result[:name])
      assert_equal('ngeor', result[:owner])
      assert_equal('java', result[:language])
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
        '--language',
        'java',
        '--provider',
        'github',
        '--username',
        'secret',
        '--password',
        'sesame',
        '--description',
        'some fancy repo'
      ]

      result = @parser.parse(argv)

      assert_equal('repo', result[:name])
      assert_equal('ngeor', result[:owner])
      assert_equal('java', result[:language])
      assert_equal(:github, result[:provider])
      assert_equal('secret', result[:username])
      assert_equal('sesame', result[:password])
      assert_equal('some fancy repo', result[:description])
    end
    # rubocop:enable Metrics/MethodLength, Metrics/AbcSize
  end
end
