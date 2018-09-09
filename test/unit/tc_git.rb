require_relative '../../git'
require 'test/unit'
require 'mocha/test_unit'

# Unit tests for Git.
class TestGit < Test::Unit::TestCase
  def setup
    @git = Git.new('https://whatever/hey.git', 'hey', 'C:/tmp')
    @git.shell = mock
  end

  def test_add
    # arrange
    @git.shell
        .expects(:system)
        .with('git add .', chdir: 'C:/tmp/hey')
        .returns(42)

    # act and assert
    assert_equal(42, @git.add)
  end

  def test_add_specific_file
    # arrange
    @git.shell.expects(:system)
        .with('git add README.md', chdir: 'C:/tmp/hey')
        .returns(42)

    # act and assert
    assert_equal(42, @git.add('README.md'))
  end

  def test_commit
    # arrange
    @git.shell.expects(:system).with(
      'git commit -m "Added badge to README"',
      chdir: 'C:/tmp/hey'
    ).returns(43)

    # act and assert
    assert_equal(43, @git.commit('Added badge to README'))
  end

  def test_clone_or_pull_clone_dir_root_missing
    # arrange
    Dir.expects(:exist?).with('C:/tmp').returns(false)

    # act and assert
    assert_raise_message('Directory C:/tmp does not exist') do
      @git.clone_or_pull
    end
  end

  def test_clone_or_pull_work_dir_missing
    # arrange
    Dir.expects(:exist?).with('C:/tmp').returns(true)
    Dir.expects(:exist?).with('C:/tmp/hey').returns(false)
    @git.shell.expects(:system)
        .with('git clone https://whatever/hey.git', chdir: 'C:/tmp')
        .returns(42)

    # act and assert
    assert_equal(42, @git.clone_or_pull)
  end

  def test_clone_or_pull_different_remotes
    # arrange
    Dir.expects(:exist?).with('C:/tmp').returns(true)
    Dir.expects(:exist?).with('C:/tmp/hey').returns(true)
    @git.shell.expects(:backticks)
        .with('git remote get-url origin', chdir: 'C:/tmp/hey')
        .returns('https://some-other-repo')

    # act and assert
    assert_raise_message('Directory C:/tmp/hey exists and points ' \
      'to different remote') do
      @git.clone_or_pull
    end
  end

  # rubocop:disable Metrics/AbcSize
  def test_clone_or_pull_matching_remotes_empty_repo
    # arrange
    Dir.expects(:exist?).with('C:/tmp').returns(true)
    Dir.expects(:exist?).with('C:/tmp/hey').returns(true)
    @git.shell.expects(:backticks)
        .with('git remote get-url origin', chdir: 'C:/tmp/hey')
        .returns('https://whatever/hey.git')
    @git.shell.expects(:backticks)
        .with('git branch -la', chdir: 'C:/tmp/hey')
        .returns('')

    # act and assert
    assert_nil(@git.clone_or_pull)
  end
  # rubocop:enable Metrics/AbcSize

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def test_clone_or_pull_matching_remotes_non_empty_repo
    # arrange
    Dir.expects(:exist?).with('C:/tmp').returns(true)
    Dir.expects(:exist?).with('C:/tmp/hey').returns(true)
    @git.shell.expects(:backticks)
        .with('git remote get-url origin', chdir: 'C:/tmp/hey')
        .returns('https://whatever/hey.git')
    @git.shell.expects(:backticks)
        .with('git branch -la', chdir: 'C:/tmp/hey')
        .returns('master')
    @git.shell.expects(:system)
        .with('git pull', chdir: 'C:/tmp/hey')
        .returns(42)

    # act and assert
    assert_equal(42, @git.clone_or_pull)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  def test_push
    # arrange
    @git.shell.expects(:system)
        .with('git push', chdir: 'C:/tmp/hey')
        .returns(44)

    # act and assert
    assert_equal(44, @git.push)
  end
end
