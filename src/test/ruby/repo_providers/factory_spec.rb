# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/factory'
require_relative '../../../main/ruby/repo_providers/github'
require_relative '../../../main/ruby/repo_providers/bitbucket'
require_relative '../../../main/ruby/repo_providers/dry_run'

RSpec.describe RepoProviders do
  describe '#create' do
    it 'should support github' do
      provider = RepoProviders.create(provider: :github)
      expect(provider).to be_instance_of(RepoProviders::GitHub)
    end

    it 'should support bitbucket' do
      provider = RepoProviders.create(provider: :bitbucket)
      expect(provider).to be_instance_of(RepoProviders::Bitbucket)
    end

    it 'should throw on unknown' do
      expect { RepoProviders.create(provider: :sourceforge) }.to raise_error(
        'Unsupported provider sourceforge'
      )
    end

    it 'should support dry run' do
      provider = RepoProviders.create(provider: :github, dry_run: true)
      expect(provider).to be_instance_of(
        RepoProviders::DryRunProviderDecorator
      )
      expect(provider.__getobj__).to be_instance_of(
        RepoProviders::GitHub
      )
    end

    it 'should initialize provider options' do
      provider = RepoProviders.create(
        provider: :github,
        name: 'repo',
        owner: 'ngeor',
        username: 'user1',
        password: 'secret'
      )
      expect(provider.name).to eq('repo')
      expect(provider.owner).to eq('ngeor')
      expect(provider.username).to eq('user1')
      expect(provider.password).to eq('secret')
    end
  end
end
