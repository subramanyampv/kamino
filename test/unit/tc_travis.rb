require_relative '../../travis'
require_relative '../../repo_options'
require 'test/unit'
require 'mocha/test_unit'

# Unit tests for Travis.
class TestTravis < Test::Unit::TestCase
  def setup
    repo_options = RepoOptions.new
    repo_options.name = 'instarepo'
    repo_options.owner = 'ngeor'
    @travis = Travis.new(repo_options, 'secret')
    @travis.rest_client = mock
  end

  def test_activate_repo
    # arrange
    url = 'https://api.travis-ci.org/repo/ngeor%2Finstarepo/activate'

    headers = {
      'Authorization' => 'token secret',
      'Travis-API-Version' => '3'
    }

    @travis.rest_client.expects(:post)
           .with(url, '', headers: headers)
           .returns(test: 42)

    # act
    result = @travis.activate_repo

    # assert
    assert_equal({ test: 42 }, result)
  end

  # rubocop:disable Metrics/MethodLength
  def test_add_badge_to_readme_not_exists
    # arrange
    read_file = ['# my repo', 'another line']
    File.expects(:open).with('C:/tmp/myrepo/README.md')
        .returns(read_file)

    write_file = mock
    write_file.expects(:puts).with("\n[![Build Status]" \
      '(https://travis-ci.org/ngeor/instarepo.svg?branch=master)]' \
      '(https://travis-ci.org/ngeor/instarepo)')
    File.expects(:open).with('C:/tmp/myrepo/README.md', 'a')
        .yields(write_file)

    # act
    result = @travis.add_badge_to_readme('C:/tmp/myrepo')

    # assert
    assert_equal(true, result)
  end
  # rubocop:enable Metrics/MethodLength

  def test_add_badge_to_readme_exists
    # arrange
    read_file = [
      '# my repo',
      'another line',
      '[![Build Status](https://travis-ci.org/ngeor/instarepo.svg?branch=master)](https://travis-ci.org/ngeor/instarepo)'
    ]
    File.expects(:open).with('C:/tmp/myrepo/README.md')
        .returns(read_file)

    # act
    result = @travis.add_badge_to_readme('C:/tmp/myrepo')

    # assert
    assert_equal(false, result)
  end
end
