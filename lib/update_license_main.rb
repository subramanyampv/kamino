require "optparse"
require "tmpdir"

require "./lib/github_client"
require "./lib/update_license"
require "./lib/switch_to_openjdk"
require "./lib/Repository"

def process_repo(username, repo, branch_name)
  if repo["fork"]
    puts "Ignoring fork"
    return
  end

  if repo["archived"]
    puts "Ignoring archived"
    return
  end

  Dir.mktmpdir do |dir|
    puts dir
    repository = Repository.new(repo)
    repository.clone dir
    repository.configure "license-bot", "license-bot@noreply.com"
    repository.checkout branch_name
    has_changes = []
    has_changes << update_license_file(repository.working_dir)
    # has_changes << switch_to_openjdk(repository.working_dir)
    if has_changes.include?(true)
      repository.add "."
      repository.status
      repository.commit "Updated license copyright to #{Time.now.year}"
      repository.push branch_name
    end

    has_changes.include?(true)
  end
end

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

    opts.on("-r", "--repo repo_name", "The GitHub repo") do |r|
      args.repo_name = r
    end
  end
  opt_parser.parse!
  args
end

args = parse
raise "Username is mandatory" unless args.username

username = args.username
password = args.password
branch_name = "license-bot"

github_client = GitHubClient.new
github_client.username = username
github_client.password = password
github_client.each_repos(username) do |repo|
  if !args.repo_name || args.repo_name == repo["name"]
    puts "Processing repo #{repo["name"]}"
    if process_repo(username, repo, branch_name)
      github_client.create_pr(username, repo["name"], branch_name, "Updating license")
    end
  end
end
