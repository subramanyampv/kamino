require "json"
require "net/http"

class GitHubClient
  attr_accessor :username
  attr_accessor :password

  def get_repos_next_page(url)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    req["Accept"] = "application/vnd.github.v3+json"
    basic_auth req
    res = Net::HTTP.start(uri.host, uri.port, :use_ssl => true) { |http| http.request req }
    case res
    when Net::HTTPSuccess
      repositories = JSON.parse(res.body)
      # <https://api.github.com/user/461097/repos?page=2>; rel="next", <https://api.github.com/user/461097/repos?page=4>; rel="last"
      # @type [String]
      link = res.header[:link]
      # @type [String]
      next_link = link.split(",")
                      .map { |p| p.strip() }
                      .select { |p| p.end_with?("rel=\"next\"") }
                      .first
      if next_link
        next_link = next_link.slice(1, next_link.index(">") - 1)
      end
      [repositories, next_link]
    else
      raise res.body
    end
  end

  # Gets the repositories of the given user
  # @param [String] username The username
  def get_repos_first_page(username)
    url = "https://api.github.com/users/#{username}/repos"
    get_repos_next_page(url)
  end

  # Gets all the repositories of the given user (exhausting pagination)
  def each_repos(username)
    repositories, next_link = get_repos_first_page(username)
    repositories.each { |repo| yield repo }
    while next_link
      repositories, next_link = get_repos_next_page(next_link)
      repositories.each { |repo| yield repo }
    end
  end

  def get_pull_requests(username, repo_name)
    url = "https://api.github.com/repos/#{username}/#{repo_name}/pulls"
    get(url)
  end

  def get(url)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    basic_auth req
    res = Net::HTTP.start(uri.host, uri.port, :use_ssl => true) { |http| http.request req }
    case res
    when Net::HTTPSuccess
      JSON.parse(res.body)
    else
      raise res.body
    end
  end

  def create_pr(username, repo_name, branch_name, title)
    url = "https://api.github.com/repos/#{username}/#{repo_name}/pulls"
    uri = URI(url)
    req = Net::HTTP::Post.new(uri)
    basic_auth req
    req.body = {
      title: title,
      head: branch_name,
      base: "master"
    }.to_json
    res = Net::HTTP.start(uri.host, uri.port, :use_ssl => true) { |http| http.request req }
    case res
    when Net::HTTPSuccess
      JSON.parse(res.body)
    else
      raise res.body
    end
  end

  def merge_pr(url)
    merge_url = "#{url}/merge"
    uri = URI(merge_url)
    req = Net::HTTP::Put.new(uri)
    basic_auth req
    res = Net::HTTP.start(uri.host, uri.port, :use_ssl => true) { |http| http.request req }
    case res
    when Net::HTTPSuccess
      JSON.parse(res.body)
    else
      raise res.body
    end
  end

  private

  # Applies basic authentication on the given request,
  # if the username and password properties are set.
  def basic_auth(req)
    req.basic_auth username, password if username && password
  end
end
