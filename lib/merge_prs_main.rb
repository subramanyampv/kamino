require "optparse"

require "./lib/github_client"
require "./lib/merge_pr"

Options = Struct.new(:username, :password, :repo_name)

def parse
  args = Options.new
  opt_parser = OptionParser.new do |opts|
    opts.on("-h", "--help", "Prints this help") do
      puts opts
      exit
    end

    opts.on("-u", "--username USERNAME", "The GitHub username") do |u|
      args.username = u
    end

    opts.on("-p", "--password password", "The GitHub password") do |p|
      args.password = p
    end
  end
  opt_parser.parse!
  args
end

args = parse
raise "Username is mandatory" unless args.username

username = args.username
password = args.password

github_client = GitHubClient.new
github_client.username = username
github_client.password = password
github_client.each_repos(username) do |repo|
  puts "Processing repo #{repo["name"]}"

  github_client.get_pull_requests(username, repo["name"]).each do |pr|
    puts "Processing pr #{pr["url"]}"
    if github_client.can_merge?(pr)
      github_client.merge_pr(pr["url"])
    end
  end
end
