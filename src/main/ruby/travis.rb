# frozen_string_literal: true

require_relative './rest_client'

# Implements the Travis REST API and other Travis related functionality.
class Travis
  # Creates a new instance of this class.
  # +options+:: The options.
  def initialize(options)
    @options = options
    @rest_client = RestClient.new
  end

  # for the unit tests
  attr_accessor :rest_client

  def activate_repo
    url = "https://api.travis-ci.org/repo/#{encoded_slug}/activate"

    @rest_client.post(url, '', headers: {
                        'Authorization' => "token #{token}",
                        'Travis-API-Version' => '3'
                      })
  end

  def deactivate_repo
    url = "https://api.travis-ci.org/repo/#{encoded_slug}/deactivate"

    @rest_client.post(url, '', headers: {
                        'Authorization' => "token #{token}",
                        'Travis-API-Version' => '3'
                      })
  end

  # rubocop:disable Metrics/MethodLength
  def add_badge_to_readme(work_dir)
    readme_file = File.join(work_dir, 'README.md')
    badge_exists = false
    File.open(readme_file).each do |line|
      badge_exists = line.strip == travis_badge_markdown
      break if badge_exists
    end

    unless badge_exists
      File.open(readme_file, 'a') do |f|
        f.puts("\n" + travis_badge_markdown)
      end
    end

    !badge_exists
  end
  # rubocop:enable Metrics/MethodLength

  private

  def travis_badge_markdown
    '[![Build Status]' \
    "(https://travis-ci.org/#{slug}.svg?branch=master)]" \
    "(https://travis-ci.org/#{slug})"
  end

  def slug
    "#{@options[:owner]}/#{@options[:name]}"
  end

  def encoded_slug
    "#{@options[:owner]}%2F#{@options[:name]}"
  end

  def token
    @options[:token]
  end
end

# Decorator for Travis that cancels out operations that cause changes.
class DryRunTravis < SimpleDelegator
  def activate_repo
    puts 'Would have activated repo in Travis'
  end

  def deactivate_repo
    puts 'Would have deactivated repo in Travis'
  end
end

# Factory for Travis
class TravisFactory
  def create(options)
    travis = Travis.new(options)
    if options[:dry_run]
      DryRunTravis.new(travis)
    else
      travis
    end
  end
end
