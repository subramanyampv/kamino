require_relative '../../arg_handler'
require 'test/unit'
require 'mocha/test_unit'

# Unit tests for ArgHandler
class TestArgHandler < Test::Unit::TestCase
  def test_help
    # arrange
    options = {
      help: {
        help: true,
        description: 'Prints this help message and exits'
      }
    }
    arg_handler = ArgHandler.new(options)

    # act
    assert_raise SystemExit do
      arg_handler.parse(['--help'])
    end
  end

  def test_name
    # arrange
    options = {
      name: {
        description: 'The name of the repository'
      }
    }
    arg_handler = ArgHandler.new(options)

    # act
    result = arg_handler.parse(['--name', 'my-repo'])

    # assert
    assert_equal({ name: 'my-repo' }, result)
  end

  def test_name_missing
    # arrange
    options = {
      name: {
        description: 'The name of the repository'
      }
    }
    arg_handler = ArgHandler.new(options)

    # act
    assert_raise(RuntimeError.new('Missing argument for --name')) do
      arg_handler.parse(['--name'])
    end
  end

  def test_unknown_argument
    # arrange
    options = {
      name: {
        description: 'The name of the repository'
      }
    }
    arg_handler = ArgHandler.new(options)

    # act
    assert_raise(SystemExit) do
      arg_handler.parse(['--namee'])
    end
  end
end
