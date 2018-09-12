require_relative '../../main/ruby/shell'
require 'test/unit'
require 'mocha/test_unit'

# Unit tests for Shell
class TestShell < Test::Unit::TestCase
  def setup
    @shell = Shell.new
  end

  def test_system_success
    @shell.system 'echo hello'
  end

  def test_system_chdir
    @shell.system 'echo hello', chdir: '..'
  end

  def test_system_failure
    assert_raise RuntimeError do
      @shell.system 'a-command-that-should-not-exist'
    end
  end

  def test_system_nil_chdir
    assert_raise(ArgumentError.new('empty chdir')) do
      @shell.system 'echo hello', chdir: nil
    end
  end

  def test_system_empty_chdir
    assert_raise(ArgumentError.new('empty chdir')) do
      @shell.system 'echo hello', chdir: ''
    end
  end

  def test_backticks_success
    result = @shell.backticks 'echo hello'
    assert_equal('hello', result)
  end

  def test_backticks_failure
    assert_raise do
      @shell.backticks 'a-command-that-should-not-exist'
    end
  end

  def test_backticks_chdir
    result = @shell.backticks 'echo hello', chdir: '..'
    assert_equal('hello', result)
  end
end
