require_relative 'travis'

require 'test/unit'
require 'mocha/test_unit'

class TestTravis < Test::Unit::TestCase
  def setup
    @travis = Travis.new
    ENV['TRAVIS_TOKEN'] = 'secret'
  end

  def test_activate_repo
    # arrange
    uri = URI('https://api.travis-ci.org/repo/user%2Fslug/activate')

    req = mock
    req.expects(:[]=).with('Authorization', 'token secret')
    req.expects(:[]=).with('Travis-API-Version', '3')

    Net::HTTP::Post.expects(:new).with(uri).returns(req)

    res = mock
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.travis-ci.org', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    result = @travis.activate_repo 'user', 'slug'

    # assert
    assert_equal({ 'test' => 42 }, result)
  end
end
