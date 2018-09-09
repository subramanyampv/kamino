require_relative '../../basic_auth'
require_relative '../../rest_client'

require 'test/unit'
require 'mocha/test_unit'

# Unit tests for RestClient
# rubocop:disable Metrics/ClassLength
class TestRestClient < Test::Unit::TestCase
  def setup
    @rest_client = RestClient.new
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_get
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:basic_auth).with('user', 'password')
    req.expects(:content_type=).with('application/json')

    Net::HTTP::Get.expects(:new).with(uri).returns(req)

    res = Net::HTTPCreated.new(nil, 201, '')
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @rest_client.get(
      'https://api.github.com/user/repos',
      basic_auth: BasicAuth.new('user', 'password')
    )

    # assert
    assert_equal({ 'test' => 42 }, result)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_get_nil_basic_auth
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:content_type=).with('application/json')

    Net::HTTP::Get.expects(:new).with(uri).returns(req)

    res = Net::HTTPCreated.new(nil, 201, '')
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @rest_client.get(
      'https://api.github.com/user/repos'
    )

    # assert
    assert_equal({ 'test' => 42 }, result)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_get_empty_basic_auth
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:content_type=).with('application/json')

    Net::HTTP::Get.expects(:new).with(uri).returns(req)

    res = Net::HTTPCreated.new(nil, 201, '')
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @rest_client.get(
      'https://api.github.com/user/repos',
      basic_auth: BasicAuth.new('', '')
    )

    # assert
    assert_equal({ 'test' => 42 }, result)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_get_result_404
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:content_type=).with('application/json')

    Net::HTTP::Get.expects(:new).with(uri).returns(req)

    res = Net::HTTPNotFound.new(nil, 404, '')
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act and assert
    assert_raise RestClientError do
      @rest_client.get(
        'https://api.github.com/user/repos',
        basic_auth: BasicAuth.new('', '')
      )
    end
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_post_nil_basic_auth
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:content_type=).with('application/json')
    req.expects(:body=).with('{"toast":"light"}')

    Net::HTTP::Post.expects(:new).with(uri).returns(req)

    res = Net::HTTPCreated.new(nil, 201, '')
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @rest_client.post(
      'https://api.github.com/user/repos',
      toast: 'light'
    )

    # assert
    assert_equal({ 'test' => 42 }, result)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_post_headers
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:content_type=).with('application/json')
    req.expects(:body=).with('{"toast":"light"}')
    req.expects(:[]=).with('Token', 'Secret')

    Net::HTTP::Post.expects(:new).with(uri).returns(req)

    res = Net::HTTPCreated.new(nil, 201, '')
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @rest_client.post(
      'https://api.github.com/user/repos',
      { toast: 'light' },
      headers: {
        'Token' => 'Secret'
      }
    )

    # assert
    assert_equal({ 'test' => 42 }, result)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_put_nil_basic_auth_empty_response_body
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:content_type=).with('application/json')
    req.expects(:body=).with('{"toast":"light"}')

    Net::HTTP::Put.expects(:new).with(uri).returns(req)

    res = Net::HTTPSuccess.new(nil, 200, '')
    res.expects(:body).returns('')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @rest_client.put(
      'https://api.github.com/user/repos',
      toast: 'light'
    )

    # assert
    assert_nil(result)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_delete_nil_basic_auth_nil_response_body
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:content_type=).with('application/json')
    req.expects(:body=).with('')

    Net::HTTP::Delete.expects(:new).with(uri).returns(req)

    res = Net::HTTPSuccess.new(nil, 200, '')
    res.expects(:body).returns(nil)

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @rest_client.delete(
      'https://api.github.com/user/repos'
    )

    # assert
    assert_nil(result)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
end
# rubocop:enable Metrics/ClassLength
