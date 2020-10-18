# frozen_string_literal: true

require "travis"

RSpec.describe Travis do
  before(:example) do
    @rest_client = double("rest_client")
    expect(RestClient).to receive(:new).and_return(@rest_client)

    @travis = Travis.new
    @travis.name = "instarepo"
    @travis.owner = "ngeor"
    @travis.token = "secret"
  end

  describe("#activate_repo") do
    it("should activate repo") do
      # arrange
      url = "https://api.travis-ci.org/repo/ngeor%2Finstarepo/activate"

      headers = {
        "Authorization" => "token secret",
        "Travis-API-Version" => "3"
      }

      allow(@rest_client).to receive(:post)
        .with(url, "", headers: headers)
        .and_return(test: 42)

      # act
      result = @travis.activate_repo

      # assert
      expect(result).to eq(test: 42)
    end
  end

  describe("#badge") do
    it("should format the badge") do
      # arrange
      expected_badge = "[![Build Status]" \
      "(https://travis-ci.org/ngeor/instarepo.svg?branch=master)]" \
      "(https://travis-ci.org/ngeor/instarepo)"

      # act
      result = @travis.badge

      # assert
      expect(result).to eq(expected_badge)
    end
  end

  describe("#sync") do
    it "should sync repos" do
      url = "https://api.travis-ci.org/user"

      headers = {
        "Authorization" => "token secret",
        "Travis-API-Version" => "3"
      }

      user = {
        "id" => 1234,
        "is_syncing" => false
      }

      expect(@rest_client).to receive(:get)
        .at_least(:once)
        .with(url, headers: headers)
        .and_return(user)

      expect(@rest_client).to receive(:post)
        .with(
          "https://api.travis-ci.org/user/1234/sync",
          "",
          headers: headers
        )

      # act
      @travis.sync
    end
  end
end

RSpec.describe DryRunTravis do
  before(:example) do
    @travis = DryRunTravis.new(Travis.new)
  end

  describe "#activate_repo" do
    it "should only print" do
      expect(@travis).to receive(:puts)
        .with("Would have activated repo in Travis")
      @travis.activate_repo
    end
  end

  describe "#deactivate_repo" do
    it "should only print" do
      expect(@travis).to receive(:puts)
        .with("Would have deactivated repo in Travis")
      @travis.deactivate_repo
    end
  end

  describe "#sync" do
    it "should only print" do
      expect(@travis).to receive(:puts)
        .with("Would have synced repositories in Travis")
      @travis.sync
    end
  end
end

RSpec.describe TravisFactory do
  describe "#create" do
    it "should create real" do
      travis = TravisFactory.create(owner: "ngeor")
      expect(travis).to be_instance_of(Travis)
    end

    it "should create dry-run" do
      travis = TravisFactory.create(owner: "ngeor", dry_run: true)
      expect(travis).to be_instance_of(DryRunTravis)
      expect(travis.__getobj__).to be_instance_of(Travis)
    end
  end
end
