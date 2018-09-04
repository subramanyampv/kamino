require_relative '../../bitbucket'

require 'test/unit'
require 'mocha/test_unit'

class TestBitbucket < Test::Unit::TestCase
  def setup
    @bitbucket = Bitbucket.new
    ENV['BITBUCKET_USERNAME'] = 'user'
    ENV['BITBUCKET_PASSWORD'] = 'password'
  end

  def test_create_repo
    # arrange
    uri = URI('https://api.bitbucket.org/2.0/repositories/ngeor/instarepo')
    req = mock
    req.expects(:basic_auth).with('user', 'password')
    req.expects(:content_type=).with('application/json')
    req.expects(:body=).with(JSON.generate(
      scm: 'git',
      is_private: true,
      description: 'a test repository created automatically',
      language: 'java',
      fork_policy: 'no_forks',
      mainbranch: {
        type: 'branch',
        name: 'master'
      }
    ))

    Net::HTTP::Post.expects(:new).with(uri).returns(req)

    res = Net::HTTPCreated.new(nil, 201, '')
    res.expects(:body).returns('{"test": true}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.bitbucket.org', 443, use_ssl: true)
      .yields(http)
      .returns(res)

    # act
    repo = @bitbucket.create_repo('ngeor', 'instarepo')

    # assert
    assert_equal({ "test" => true }, repo)
  end

  def test_create_repo_failure
    # arrange
    uri = URI('https://api.bitbucket.org/2.0/repositories/ngeor/instarepo')
    req = mock
    req.expects(:basic_auth).with('user', 'password')
    req.expects(:content_type=).with('application/json')
    req.expects(:body=).with(JSON.generate(
      scm: 'git',
      is_private: true,
      description: 'a test repository created automatically',
      language: 'java',
      fork_policy: 'no_forks',
      mainbranch: {
        type: 'branch',
        name: 'master'
      }
    ))

    Net::HTTP::Post.expects(:new).with(uri).returns(req)

    res = Net::HTTPForbidden.new(nil, 403, 'Sorry')
    res.expects(:body).returns('oops')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.bitbucket.org', 443, use_ssl: true)
      .yields(http)
      .returns(res)

    # act and assert
    assert_raise(RuntimeError.new('403 - Sorry - oops')) {
      @bitbucket.create_repo('ngeor', 'instarepo')
    }
  end

end
