# frozen_string_literal: true

require 'rdoc/task'
require 'rspec/core/rake_task'
require 'rubocop/rake_task'

RSpec::Core::RakeTask.new(:test) do |rspec|
  rspec.pattern = 'test/**/*_spec.rb'
  rspec.rspec_opts = '-r ./test/_helper/helper -f documentation'
end

Rake::RDocTask.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.rdoc_files.include('lib/**/*.rb')
end

RuboCop::RakeTask.new(:rubocop) do |t|
  t.options = ['--display-cop-names']
end

task default: %i[rubocop test rdoc]
