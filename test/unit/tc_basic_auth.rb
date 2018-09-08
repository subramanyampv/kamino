require_relative '../../basic_auth'

require 'test/unit'

class TestBasicAuth < Test::Unit::TestCase
  def test_create
    basic_auth = BasicAuth.new('user', 'password')
    assert_equal('user', basic_auth.username)
    assert_equal('password', basic_auth.password)
  end

  def test_empty_false
    basic_auth = BasicAuth.new('user', 'password')
    assert_false(basic_auth.empty?)
  end

  def test_empty_true
    basic_auth = BasicAuth.new('', 'password')
    assert_true(basic_auth.empty?)
  end

  def test_empty_true_nil_username
    basic_auth = BasicAuth.new(nil, 'password')
    assert_true(basic_auth.empty?)
  end

  def test_equal
    a = BasicAuth.new('user', 'password')
    b = BasicAuth.new('user', 'password')
    c = BasicAuth.new('abcd', 'password')
    d = BasicAuth.new('user', '12345678')

    assert_true(a == b)
    assert_false(a == c)
    assert_false(a == d)
    assert_false(c == d)
  end
end
