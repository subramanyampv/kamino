require_relative 'git'

require 'test/unit'
require 'mocha/test_unit'

class TestGit < Test::Unit::TestCase
  def setup
    @git = Git.new
  end

  def test_clone
    # arrange
    Kernel.expects(:system).with(
      'git clone https://whatever/hey.git',
      chdir: 'C:/tmp'
    ).returns(true)

    # act
    result = @git.clone('https://whatever/hey.git', 'C:/tmp')

    # assert
    assert_equal(true, result)
  end
end
