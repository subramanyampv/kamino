require 'json'
require 'net/http'

##
# Implements the Travis REST API and other Travis related functionality.
class Travis

  ##
  # Creates a new instance of this class.
  #
  # +owner+ The owner of the repository.
  #
  # +repo+  The name of the repository.
  def initialize(owner, repo)
    @owner = owner
    @repo = repo
  end

  def activate_repo
    slug = "#{@owner}%2F#{@repo}"
    uri = URI("https://api.travis-ci.org/repo/#{slug}/activate")
    req = Net::HTTP::Post.new(uri)
    req['Authorization'] = 'token ' + token
    req['Travis-API-Version'] = '3'
    res = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
      http.request(req)
    end
    JSON.parse(res.body)
  end

  def add_badge_to_readme(work_dir)
    readme_file = File.join(work_dir, 'README.md')
    badge_exists = false
    File.open(readme_file).each do |line|
      badge_exists = line.strip == travis_badge_markdown
      break if badge_exists
    end

    if not badge_exists
      File.open(readme_file, 'a') do |f|
        f.puts("\n" + travis_badge_markdown)
      end
    end

    not badge_exists
  end

  private

  def token
    ENV['TRAVIS_TOKEN']
  end

  def travis_badge_markdown
    "[![Build Status](https://travis-ci.org/#{@owner}/#{@repo}.svg?branch=master)](https://travis-ci.org/#{@owner}/#{@repo})"
  end

end
