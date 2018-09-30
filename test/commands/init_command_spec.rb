# frozen_string_literal: true

require 'commands/init_command'

RSpec.describe Commands::InitCommand do
  context 'without travis badge' do
    before(:example) do
      options = {
        name: 'dummy',
        description: 'my new awesome repo',
        clone_dir: 'C:/tmp',
        owner: 'owner',
        username: 'username',
        password: 'secret',
        provider: :github
      }

      @provider = double('provider')
      @git = double('git')
      @file_system = double('file_system')

      expect(RepoProviders).to receive(:create)
        .with(options)
        .and_return(@provider)

      expect(@provider).to receive(:clone_url).and_return('https://whatever')

      expect(GitFactory).to receive(:create)
        .with(options)
        .and_return(@git)

      expect(@git).to receive(:clone_url=).with('https://whatever')
      expect(@git).to receive(:repo_name=).with('dummy')
      expect(@git).to receive(:clone_dir=).with('C:/tmp')

      expect(FileSystemFactory).to receive(:create)
        .with(options)
        .and_return(@file_system)

      @travis = double('travis')
      expect(TravisFactory).to receive(:create)
        .with(options)
        .and_return(@travis)

      @command = Commands::InitCommand.new(options)
    end

    context 'when repo exists' do
      before(:example) do
        expect(@provider).to receive(:repo_exist?).and_return(true)
        expect(@git).to receive(:clone_or_pull).and_return(42)
        expect(@git).to receive(:working_dir).and_return('C:/tmp/dummy')
      end

      context 'when README exists' do
        before(:example) do
          expect(@file_system).to receive(:file?)
            .with('C:/tmp/dummy/README.md')
            .and_return(true)
        end

        it 'should not do anything because the repo is already initialized' do
          @command.run
        end
      end

      context 'when README does not exist' do
        before(:example) do
          expect(@file_system).to receive(:file?)
            .with('C:/tmp/dummy/README.md')
            .and_return(false)
        end

        it 'should initialize the repo' do
          expected_contents = "# dummy\nmy new awesome repo\n"
          expect(@file_system).to receive(:write)
            .with('C:/tmp/dummy/README.md', expected_contents)
          expect(@git).to receive(:add).with('README.md')
          expect(@git).to receive(:commit).with('Added README')
          expect(@git).to receive(:push)
          @command.run
        end
      end
    end

    context 'when repo does not exist' do
      before(:example) do
        expect(@provider).to receive(:repo_exist?).and_return(false)
      end

      it 'should not initialize the repo' do
        expect(@command).to receive(:puts).with('Repo does not exist')
        @command.run
      end
    end
  end

  context 'with travis badge' do
    before(:example) do
      options = {
        name: 'dummy',
        description: 'my new awesome repo',
        clone_dir: 'C:/tmp',
        owner: 'owner',
        username: 'username',
        password: 'secret',
        provider: :github,
        travis_badge: true
      }

      @provider = double('provider')
      @git = double('git')
      @file_system = double('file_system')

      expect(RepoProviders).to receive(:create)
        .with(options)
        .and_return(@provider)

      expect(@provider).to receive(:clone_url).and_return('https://whatever')

      expect(GitFactory).to receive(:create)
        .with(options)
        .and_return(@git)

      expect(@git).to receive(:clone_url=).with('https://whatever')
      expect(@git).to receive(:repo_name=).with('dummy')
      expect(@git).to receive(:clone_dir=).with('C:/tmp')

      expect(FileSystemFactory).to receive(:create)
        .with(options)
        .and_return(@file_system)

      @travis = double('travis')
      expect(TravisFactory).to receive(:create)
        .with(options)
        .and_return(@travis)

      @command = Commands::InitCommand.new(options)

      # repo exists
      expect(@provider).to receive(:repo_exist?).and_return(true)
      expect(@git).to receive(:clone_or_pull).and_return(42)
      expect(@git).to receive(:working_dir).and_return('C:/tmp/dummy')
    end

    context 'when README exists' do
      before(:example) do
        expect(@file_system).to receive(:file?)
          .with('C:/tmp/dummy/README.md')
          .and_return(true)
        expect(@travis).to receive(:badge)
          .and_return('travis badge')
      end

      context 'when README contains badge' do
        before(:example) do
          expect(@file_system).to receive(:line_exist?)
            .with('C:/tmp/dummy/README.md', 'travis badge')
            .and_return(true)
        end

        it 'should not do anything because the repo is already initialized' do
          @command.run
        end
      end

      context 'when README does not contain badge' do
        before(:example) do
          expect(@file_system).to receive(:line_exist?)
            .with('C:/tmp/dummy/README.md', 'travis badge')
            .and_return(false)
        end

        it 'should append badge' do
          expect(@file_system).to receive(:append)
            .with('C:/tmp/dummy/README.md', 'travis badge')
          expect(@git).to receive(:add).with('README.md')
          expect(@git).to receive(:commit).with('Added Travis badge to README')
          expect(@git).to receive(:push)
          @command.run
        end
      end
    end

    context 'when README does not exist' do
      before(:example) do
        expect(@file_system).to receive(:file?)
          .with('C:/tmp/dummy/README.md')
          .and_return(false)
        expect(@travis).to receive(:badge)
          .and_return('travis badge')
      end

      it 'should initialize the repo' do
        expected_contents = "# dummy\nmy new awesome repo\ntravis badge\n"
        expect(@file_system).to receive(:write)
          .with('C:/tmp/dummy/README.md', expected_contents)
        expect(@git).to receive(:add).with('README.md')
        expect(@git).to receive(:commit).with('Added README')
        expect(@git).to receive(:push)
        @command.run
      end
    end
  end
end
