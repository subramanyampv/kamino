require_relative '../../main/ruby/arg_handler'
require 'test/unit'
require 'mocha/test_unit'

# Unit tests for ArgHandler
class TestArgHandler < Test::Unit::TestCase
  def setup
    @arg_handler = ArgHandler.new
  end

  def test_name
    result = @arg_handler.parse(['create', '--name', 'my-repo'])
    assert_equal({ name: 'my-repo' }, result)
  end

  def test_name_missing
    assert_raise(OptionParser::MissingArgument) do
      @arg_handler.parse(['create', '--name'])
    end
  end

  def test_unknown_argument
    assert_raise(OptionParser::InvalidOption) do
      @arg_handler.parse(['create', '--namee'])
    end
  end
end
