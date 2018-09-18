# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/factory'
require_relative '../../../main/ruby/repo_providers/github'
require_relative '../../../main/ruby/repo_providers/bitbucket'

RSpec.describe RepoProviders::Factory do
  describe '#create' do
    before(:example) do
      @factory = RepoProviders::Factory.new
    end

    it 'should support github' do
      provider = @factory.create(provider: :github)
      expect(provider).to be_instance_of(RepoProviders::GitHub)
    end

    it 'should support bitbucket' do
      provider = @factory.create(provider: :bitbucket)
      expect(provider).to be_instance_of(RepoProviders::Bitbucket)
    end

    it 'should throw on unknown' do
      expect { @factory.create(provider: :sourceforge) }.to raise_error(
        'Unsupported provider sourceforge'
      )
    end

    it 'should support dry run' do
      provider = @factory.create(provider: :github, dry_run: true)
      expect(provider).to be_instance_of(
        RepoProviders::DryRunProviderDecorator
      )
      expect(provider.__getobj__).to be_instance_of(
        RepoProviders::GitHub
      )
    end
  end
end
