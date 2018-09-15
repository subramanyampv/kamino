require_relative '../../../main/ruby/cli/create_sub_command'
require 'test/unit'
require 'mocha/test_unit'

module CLI
  # Unit tests for CreateSubCommand
  class TestCreateSubCommand < Test::Unit::TestCase
    def setup
      @command = CreateSubCommand.new
    end

    def test_name
      assert_equal('create', @command.name)
    end

    # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    def test_short_options
      options = {}
      argv = [
        '-nrepo',
        '-ongeor',
        '-ljava',
        '-pgithub',
        '-usecret'
      ]

      result = @command.order!(options, argv)

      assert_equal(result, options)
      assert_equal('repo', result[:name])
      assert_equal('ngeor', result[:owner])
      assert_equal('java', result[:language])
      assert_equal(:github, result[:provider])
      assert_equal('secret', result[:username])
    end

    def test_long_options
      options = {}
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

      result = @command.order!(options, argv)

      assert_equal(result, options)
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
