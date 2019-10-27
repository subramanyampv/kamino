# frozen_string_literal: true

require "basic_auth"

RSpec.describe BasicAuth do
  describe "#create" do
    it "should initialize correctly" do
      basic_auth = BasicAuth.new("user", "password")
      expect(basic_auth.username).to eq("user")
      expect(basic_auth.password).to eq("password")
    end
  end

  describe "#empty?" do
    it "should not be empty when username is provided" do
      basic_auth = BasicAuth.new("user", "")
      expect(basic_auth.empty?).to be false
    end

    it "should be empty when username is empty" do
      basic_auth = BasicAuth.new("", "")
      expect(basic_auth.empty?).to be true
    end

    it "should be empty when username is nil" do
      basic_auth = BasicAuth.new(nil, "")
      expect(basic_auth.empty?).to be true
    end
  end

  describe "#equal" do
    it "should be equal when username and password are equal" do
      a = BasicAuth.new("user", "password")
      b = BasicAuth.new("user", "password")
      expect(a == b).to be true
    end

    it "should not be equal when username differs" do
      a = BasicAuth.new("user", "password")
      b = BasicAuth.new("user2", "password")
      expect(a == b).to be false
    end

    it "should not be equal when password differs" do
      a = BasicAuth.new("user", "password")
      b = BasicAuth.new("user", "password2")
      expect(a == b).to be false
    end
  end
end
