require_relative '../../travis'

require 'test/unit'
require 'mocha/test_unit'

class TestTravis < Test::Unit::TestCase
  def setup
    @travis = Travis.new('ngeor', 'instarepo')
    ENV['TRAVIS_TOKEN'] = 'secret'
  end

  def test_activate_repo
    # arrange
    uri = URI('https://api.travis-ci.org/repo/ngeor%2Finstarepo/activate')

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
    result = @travis.activate_repo

    # assert
    assert_equal({ 'test' => 42 }, result)
  end

  def test_add_badge_to_readme_not_exists
    # arrange
    readFile = [
      '# my repo',
      'another line'
    ]
    File.expects(:open).with('C:/tmp/myrepo/README.md')
      .returns(readFile)

    writeFile = mock
    writeFile.expects(:puts).with("\n[![Build Status](https://travis-ci.org/ngeor/instarepo.svg?branch=master)](https://travis-ci.org/ngeor/instarepo)")
    File.expects(:open).with('C:/tmp/myrepo/README.md', 'a')
      .yields(writeFile)

    # act
    result = @travis.add_badge_to_readme('C:/tmp/myrepo')

    # assert
    assert_equal(true, result)
  end

  def test_add_badge_to_readme_exists
    # arrange
    readFile = [
      '# my repo',
      'another line',
      "[![Build Status](https://travis-ci.org/ngeor/instarepo.svg?branch=master)](https://travis-ci.org/ngeor/instarepo)"
    ]
    File.expects(:open).with('C:/tmp/myrepo/README.md')
      .returns(readFile)

    # act
    result = @travis.add_badge_to_readme('C:/tmp/myrepo')

    # assert
    assert_equal(false, result)
  end

end
