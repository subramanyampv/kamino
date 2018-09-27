# frozen_string_literal: true

require_relative '../../../main/ruby/commands/init_repo_command'
require_relative '../../../main/ruby/repo_providers/factory'
require_relative '../../../main/ruby/git'

RSpec.describe Commands::InitRepoCommand do
  context 'in dry run' do
    it 'should create git in dry run mode' do
      options = {
        dry_run: true
      }

      expect(RepoProviders).to receive(:create)
        .with(options)
      expect(GitFactory).to receive(:create)
        .with(dry_run: true)

      @command = Commands::InitRepoCommand.new(options)
    end
  end

  context 'not in dry run' do
    before(:example) do
      options = {
        name: 'dummy',
        description: 'my new awesome repo',
        clone_dir: 'C:/tmp'
      }

      @provider = double('provider')
      @git = double('git')
      @file_system = double('file_system')

      expect(RepoProviders).to receive(:create)
        .with(options)
        .and_return(@provider)

      expect(GitFactory).to receive(:create)
        .with(dry_run: false)
        .and_return(@git)

      @command = Commands::InitRepoCommand.new(options)
      @command.file_system = @file_system
    end

    context 'when repo exists' do
      before(:example) do
        allow(@provider).to receive(:repo_exists?).and_return(true)
        allow(@provider).to receive(:clone_url).and_return('ssh://host')

        allow(@git).to receive(:clone_url=).with('ssh://host')
        allow(@git).to receive(:repo_name=).with('dummy')
        allow(@git).to receive(:clone_dir=).with('C:/tmp')
        allow(@git).to receive(:clone_or_pull).and_return(42)
        allow(@git).to receive(:working_dir).and_return('C:/tmp/dummy')
      end

      context 'when README exists' do
        before(:example) do
          allow(@file_system).to receive(:file?)
            .with('C:/tmp/dummy/README.md')
            .and_return(true)
        end

        it 'should return true because the repo is already initialized' do
          expect(@command.run).to be true
        end
      end

      context 'when README does not exist' do
        before(:example) do
          allow(@file_system).to receive(:file?)
            .with('C:/tmp/dummy/README.md')
            .and_return(false)
          expected_contents = "# dummy\nmy new awesome repo\n"
          allow(@file_system).to receive(:write)
            .with('C:/tmp/dummy/README.md', expected_contents)
          allow(@git).to receive(:add).with('README.md')
          allow(@git).to receive(:commit).with('Added README')
          allow(@git).to receive(:push)
        end

        it 'should initialize the repo' do
          expect(@command.run).to be true
        end
      end
    end

    context 'when repo does not exist' do
      before(:example) do
        allow(@provider).to receive(:repo_exists?).and_return(false)
      end

      it 'should not initialize the repo' do
        expect(@command).to receive(:puts).with('Repo does not exist')
        expect(@command.run).to be false
      end
    end
  end
end
