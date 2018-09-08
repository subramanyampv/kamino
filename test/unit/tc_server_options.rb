require_relative '../../server_options'

require 'test/unit'

# Unit tests for ServerOptions.
class TestServerOptions < Test::Unit::TestCase
  def test_create
    server_options = ServerOptions.new
    assert_nil(server_options.provider)
    assert_nil(server_options.username)
    assert_nil(server_options.password)
    assert_equal(
      'ServerOptions {provider: , username: , password: }',
      server_options.to_s
    )
  end

  # rubocop:disable Metrics/MethodLength
  def test_with_properties
    server_options = ServerOptions.new
    server_options.provider = 'GitHub'
    server_options.username = 'ngeor'
    server_options.password = 'secret'

    assert_equal('GitHub', server_options.provider)
    assert_equal('ngeor', server_options.username)
    assert_equal('secret', server_options.password)
    assert_equal(
      'ServerOptions {provider: GitHub, username: ngeor, password: secret}',
      server_options.to_s
    )
  end
  # rubocop:enable Metrics/MethodLength
end
