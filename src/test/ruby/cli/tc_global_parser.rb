# frozen_string_literal: true

require_relative '../../../main/ruby/cli/global_parser'
require 'test/unit'
require 'mocha/test_unit'

module CLI
  # Dummy sub-command parser for this unit test file.
  class DummyParser
    def name
      'dummy'
    end

    def parse(argv)
      { dummy: argv }
    end
  end

  # Unit tests for GlobalParser
  class TestGlobalParser < Test::Unit::TestCase
    def setup
      @parser = GlobalParser.new([DummyParser])
    end

    def test_no_sub_command_args
      result = @parser.parse(['dummy'])
      assert_equal({ command: :dummy, dummy: [] }, result)
    end

    def test_sub_command_args
      result = @parser.parse(['dummy', '--oops'])
      assert_equal({ command: :dummy, dummy: ['--oops'] }, result)
    end

    def test_dry_run
      result = @parser.parse(['--dry-run', 'dummy'])
      assert_equal({ command: :dummy, dummy: [], dry_run: true }, result)
    end

    def test_missing_command
      assert_raise(OptionParser::MissingArgument) do
        @parser.parse([])
      end
    end

    def test_wrong_command
      assert_raise(OptionParser::InvalidOption) do
        @parser.parse(['createee'])
      end
    end
  end
end
