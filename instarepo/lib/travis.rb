# frozen_string_literal: true

require "delegate"
require_relative "./rest_client"
require_relative "./repo"

# Implements the Travis REST API and other Travis related functionality.
class Travis
  # Creates a new instance of this class.
  def initialize
    @rest_client = RestClient.new
  end

  include RepoMixin

  attr_accessor :token

  def activate_repo
    url = "https://api.travis-ci.org/repo/#{encoded_slug}/activate"
    @rest_client.post(url, "", headers: travis_headers)
  end

  def deactivate_repo
    url = "https://api.travis-ci.org/repo/#{encoded_slug}/deactivate"
    @rest_client.post(url, "", headers: travis_headers)
  end

  def badge
    "[![Build Status]" \
    "(https://travis-ci.org/#{slug}.svg?branch=master)]" \
    "(https://travis-ci.org/#{slug})"
  end

  def sync
    wait_until_sync_is_over
    puts user
    user_id = user["id"]
    url = "https://api.travis-ci.org/user/#{user_id}/sync"
    @rest_client.post(url, "", headers: travis_headers)
    wait_until_sync_is_over
  end

  private

  # Gets information about the current user
  def user
    # https://developer.travis-ci.com/resource/user#sync
    url = "https://api.travis-ci.org/user"
    @rest_client.get(url, headers: travis_headers)
  end

  def syncing?
    user["is_syncing"]
  end

  def wait_until_sync_is_over
    while syncing?
      puts "Waiting until sync is over"
      sleep 5
    end
  end

  def travis_headers
    {
      "Authorization" => "token #{token}",
      "Travis-API-Version" => "3"
    }
  end
end

# Decorator for Travis that cancels out operations that cause changes.
class DryRunTravis < SimpleDelegator
  def activate_repo
    puts "Would have activated repo in Travis"
  end

  def deactivate_repo
    puts "Would have deactivated repo in Travis"
  end

  def sync
    puts "Would have synced repositories in Travis"
  end
end

# Factory for Travis
module TravisFactory
  def self.create(options)
    travis = Travis.new
    travis.name = options[:name]
    travis.owner = options[:owner]
    travis.token = options[:token]
    if options[:dry_run]
      DryRunTravis.new(travis)
    else
      travis
    end
  end
end
