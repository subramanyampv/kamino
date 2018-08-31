require_relative '../../git'

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

class TestGitWorkingDirectory < Test::Unit::TestCase
  def setup
    @git = GitWorkingDirectory.new('C:/myrepo')
  end

  def test_add
    # arrange
    Kernel.expects(:system).with('git add .', chdir: 'C:/myrepo').returns(42)

    # act and assert
    assert_equal(42, @git.add)
  end

  def test_add_specific_file
    # arrange
    Kernel.expects(:system).with('git add README.md', chdir: 'C:/myrepo').returns(42)

    # act and assert
    assert_equal(42, @git.add('README.md'))
  end

  def test_commit
    # arrange
    Kernel.expects(:system).with(
      "git commit -m \"Added badge to README\"",
      chdir: 'C:/myrepo'
    ).returns(43)

    # act and assert
    assert_equal(43, @git.commit('Added badge to README'))
  end

  def test_push
    # arrange
    Kernel.expects(:system).with('git push', chdir: 'C:/myrepo').returns(44)

    # act and assert
    assert_equal(44, @git.push)
  end
end
