# frozen_string_literal: true

require_relative '../../../main/ruby/repo_providers/dry_run'

RSpec.describe RepoProviders::DryRunProviderDecorator do
  before(:example) do
    @provider = double('provider')
    @decorator = RepoProviders::DryRunProviderDecorator.new(@provider)
  end

  describe('#repos') do
    it('should get all repos') do
      expect(@provider).to receive(:repos).and_return(42)
      expect(@decorator.repos).to eq(42)
    end
  end

  describe('#clone_url') do
    it('should use ssh by default') do
      expect(@provider).to receive(:clone_url).and_return('hello')
      expect(@decorator.clone_url).to eq('hello')
    end
  end

  describe('#repo_exists') do
    it('should return true when the repo exists') do
      expect(@provider).to receive(:repo_exist?).and_return(true)
      expect(@decorator.repo_exist?).to eq(true)
    end
  end

  describe('#create_repo') do
    it('should not create') do
      expect(@decorator).to receive(:puts).with('Would have created repo')
      @decorator.create_repo(description: 'My brand new repo')
    end
  end

  describe('#delete_repo') do
    it('should not delete') do
      expect(@decorator).to receive(:puts).with('Would have deleted repo')
      @decorator.delete_repo
    end
  end

  describe('#activate_repo') do
    it('should not activate') do
      expect(@decorator).to receive(:puts).with('Would have activated repo')
      @decorator.activate_repo
    end
  end

  describe('#deactivate_repo') do
    it('should not deactivate') do
      expect(@decorator).to receive(:puts).with('Would have deactivated repo')
      @decorator.deactivate_repo
    end
  end
end
