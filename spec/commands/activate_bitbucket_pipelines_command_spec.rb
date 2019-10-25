# frozen_string_literal: true

require 'commands/activate_bitbucket_pipelines_command'
require 'repo_providers/factory'

RSpec.describe Commands::ActivateBitbucketPipelinesCommand do
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
