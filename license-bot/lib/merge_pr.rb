# Automatically merge pull requests if the CI has passed

require "json"
require "net/http"
require "./lib/github_client"

class GitHubClient
  def can_merge?(pr)
    url = pr["url"]
    state = pr["state"]
    locked = pr["locked"]

    if locked
      puts "Ignoring locked pr #{url}"
      return false
    end

    if state != "open"
      puts "Ignoring pr #{url} in state #{state}"
      return false
    end

    pr_details = get(url)
    merged = pr_details["merged"]
    mergeable = pr_details["mergeable"]
    if merged
      puts "Ignoring already merged pr #{url}"
      return false
    end

    if !mergeable
      puts "Ignoring non-mergeable pr #{url}"
      return false
    end

    links = pr["_links"]
    links_statuses = links["statuses"]
    statuses_href = links_statuses["href"]
    statuses = get(statuses_href).map { |s| s["state"] }
    if statuses.empty?
      # puts "Cannot merge pr because there is no reported status #{url}"
      return true
    end

    if statuses.include?("error")
      puts "Cannot merge pr due to error status #{url}"
      return false
    end
    if !statuses.include?("success")
      puts "Cannot merge pr because no successful statuses exists #{url}"
      return false
    end

    return true
  end
end
