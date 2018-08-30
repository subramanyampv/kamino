require 'rake/testtask'
require 'rdoc/task'

Rake::TestTask.new(:test) do |t|
  t.libs << 'test'
  t.verbose = true
  t.pattern = 'test/**/*.rb'
end

task default: :test

Rake::RDocTask.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.rdoc_files.include('*.rb')
end
