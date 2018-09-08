require_relative '../../rest_client'

require 'test/unit'
require 'mocha/test_unit'

# Unit tests for RestClient
class TestRestClient < Test::Unit::TestCase
  def setup
    @rest_client = RestClient.new
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_get_repos
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
end
