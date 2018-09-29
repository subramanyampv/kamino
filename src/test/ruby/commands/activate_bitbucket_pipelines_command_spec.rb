# frozen_string_literal: true

# rubocop:disable Metrics/LineLength
require_relative '../../../main/ruby/commands/activate_bitbucket_pipelines_command'
require_relative '../../../main/ruby/repo_providers/factory'
# rubocop:enable Metrics/LineLength

RSpec.describe Commands::ActivateBitbucketPipelinesCommand do
  describe 'not dry run' do
    before(:example) do
      options = {
        name: 'dummy',
        username: 'username',
        password: 'password',
        owner: 'owner'
      }

      @bitbucket = double('bitbucket')
      expect(RepoProviders).to receive(:create)
        .with(
          provider: :bitbucket,
          name: 'dummy',
          username: 'username',
          password: 'password',
          owner: 'owner'
        )
        .and_return(@bitbucket)

      @command = Commands::ActivateBitbucketPipelinesCommand.new(options)
    end

    describe '#run' do
      it 'should activate the repo' do
        expect(@bitbucket).to receive(:activate_repo)
          .and_return(42)
        expect(@command.run).to eq(42)
      end
    end
  end

  describe 'dry run' do
    before(:example) do
      options = {
        name: 'dummy',
        username: 'username',
        password: 'password',
        owner: 'owner',
        dry_run: true
      }

      @bitbucket = double('bitbucket')
      expect(RepoProviders).to receive(:create)
        .with(
          provider: :bitbucket, dry_run: true, name: 'dummy',
          username: 'username', password: 'password', owner: 'owner'
        )
        .and_return(@bitbucket)

      @command = Commands::ActivateBitbucketPipelinesCommand.new(options)
    end

    describe '#run' do
      it 'should activate the repo' do
        expect(@bitbucket).to receive(:activate_repo)
          .and_return(42)
        expect(@command.run).to eq(42)
      end
    end
  end
end
