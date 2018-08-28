require_relative 'github'

require 'test/unit'
require 'mocha/test_unit'

class TestGithub < Test::Unit::TestCase
  def setup
    @github = Github.new
    ENV['GITHUB_USERNAME'] = 'user'
    ENV['GITHUB_PASSWORD'] = 'password'
  end

  def test_get_repos
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:basic_auth).with('user', 'password')

    Net::HTTP::Get.expects(:new).with(uri).returns(req)

    res = mock
    res.expects(:body).returns('{"test":42}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    repos = @github.get_repos

    # assert
    assert_equal({ 'test' => 42 }, repos)
  end

  def test_create_repo
    # arrange
    uri = URI('https://api.github.com/user/repos')

    req = mock
    req.expects(:basic_auth).with('user', 'password')
    req.expects(:body=).with(JSON.generate({
      :name => 'test',
      :description => 'a test repository created automatically',
      :auto_init => true,
      :gitignore_template => 'Maven',
      :license_template => 'mit'
    }))

    Net::HTTP::Post.expects(:new).with(uri).returns(req)

    res = mock
    res.expects(:body).returns('{"test":true}')

    http = mock
    http.expects(:request).with(req)

    Net::HTTP.expects(:start).with('api.github.com', 443, use_ssl: true)
             .yields(http)
             .returns(res)

    # act
    repo = @github.create_repo

    # assert
    assert_equal({ 'test' => true }, repo)
  end
end
