# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/factory'
require_relative '../../../main/ruby/repo_providers/github'
require_relative '../../../main/ruby/repo_providers/bitbucket'

RSpec.describe RepoProviders::Factory do
  describe '#create' do
    it 'should support github' do
      factory = RepoProviders::Factory.new(provider: :github)
      provider = factory.create
      expect(provider).to be_instance_of(RepoProviders::GitHub)
    end

    it 'should support bitbucket' do
      factory = RepoProviders::Factory.new(provider: :bitbucket)
      provider = factory.create
      expect(provider).to be_instance_of(RepoProviders::Bitbucket)
    end

    it 'should throw on unknown' do
      factory = RepoProviders::Factory.new(provider: :sourceforge)
      expect { factory.create }.to raise_error(
        'Unsupported provider sourceforge'
      )
    end

    it 'should support dry run' do
      factory = RepoProviders::Factory.new(provider: :github, dry_run: true)
      provider = factory.create
      expect(provider).to be_instance_of(
        RepoProviders::DryRunProviderDecorator
      )
      expect(provider.__getobj__).to be_instance_of(
        RepoProviders::GitHub
      )
    end
  end
end
