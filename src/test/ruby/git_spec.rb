# frozen_string_literal: true

require_relative '../../main/ruby/git'

RSpec.describe Git do
  before(:example) do
    @shell = double('shell')
    @git = Git.new('https://whatever/hey.git', 'hey', 'C:/tmp', @shell)
  end

  describe('#add') do
    it('should add all by default') do
      # arrange
      allow(@shell).to receive(:system)
        .with('git add .', chdir: 'C:/tmp/hey')
        .and_return(42)

      # act and assert
      expect(@git.add).to eq(42)
    end

    it('should add specific file') do
      # arrange
      allow(@shell).to receive(:system)
        .with('git add README.md', chdir: 'C:/tmp/hey')
        .and_return(42)

      # act and assert
      expect(@git.add('README.md')).to eq(42)
    end
  end

  describe('#commit') do
    it('should commit') do
      # arrange
      allow(@shell).to receive(:system).with(
        'git commit -m "Added badge to README"',
        chdir: 'C:/tmp/hey'
      ).and_return(43)

      # act and assert
      expect(@git.commit('Added badge to README')).to eq(43)
    end
  end

  describe('#clone_or_pull') do
    it('should throw when the clone_dir_root is missing') do
      # arrange
      allow(Dir).to receive(:exist?).with('C:/tmp').and_return(false)

      # act and assert
      expect { @git.clone_or_pull }.to raise_error(
        'Directory C:/tmp does not exist'
      )
    end

    it('should clone when the work_dir is missing') do
      # arrange
      allow(Dir).to receive(:exist?).with('C:/tmp').and_return(true)
      allow(Dir).to receive(:exist?).with('C:/tmp/hey').and_return(false)
      allow(@shell).to receive(:system)
        .with('git clone https://whatever/hey.git', chdir: 'C:/tmp')
        .and_return(42)

      # act and assert
      expect(@git.clone_or_pull).to eq(42)
    end

    it('should throw when the work_dir points to a different git remote') do
      # arrange
      allow(Dir).to receive(:exist?).with('C:/tmp').and_return(true)
      allow(Dir).to receive(:exist?).with('C:/tmp/hey').and_return(true)
      allow(@shell).to receive(:backticks)
        .with('git remote get-url origin', chdir: 'C:/tmp/hey')
        .and_return('https://some-other-repo')

      # act and assert
      expect { @git.clone_or_pull }.to raise_error(
        'Directory C:/tmp/hey exists and points to different remote'
      )
    end

    it('should not pull when the repo is empty') do
      # arrange
      allow(Dir).to receive(:exist?).with('C:/tmp').and_return(true)
      allow(Dir).to receive(:exist?).with('C:/tmp/hey').and_return(true)
      allow(@shell).to receive(:backticks)
        .with('git remote get-url origin', chdir: 'C:/tmp/hey')
        .and_return('https://whatever/hey.git')
      allow(@shell).to receive(:backticks)
        .with('git branch -la', chdir: 'C:/tmp/hey')
        .and_return('')

      # act and assert
      expect(@git.clone_or_pull).to be_nil
    end

    it('should pull when the working dir is not empty') do
      # arrange
      allow(Dir).to receive(:exist?).with('C:/tmp').and_return(true)
      allow(Dir).to receive(:exist?).with('C:/tmp/hey').and_return(true)
      allow(@shell).to receive(:backticks)
        .with('git remote get-url origin', chdir: 'C:/tmp/hey')
        .and_return('https://whatever/hey.git')
      allow(@shell).to receive(:backticks)
        .with('git branch -la', chdir: 'C:/tmp/hey')
        .and_return('master')
      allow(@shell).to receive(:system)
        .with('git pull', chdir: 'C:/tmp/hey')
        .and_return(42)

      # act and assert
      expect(@git.clone_or_pull).to eq(42)
    end
  end

  describe('#push') do
    it('should push') do
      # arrange
      allow(@shell).to receive(:system)
        .with('git push', chdir: 'C:/tmp/hey')
        .and_return(44)

      # act and assert
      expect(@git.push).to eq(44)
    end
  end

  describe('#working_dir') do
    it('should have the expected value') do
      expect(@git.working_dir).to eq('C:/tmp/hey')
    end
  end
end
