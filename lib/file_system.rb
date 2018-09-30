# frozen_string_literal: true

require 'delegate'

# A helper that deals with files.
class FileSystem
  def file?(file)
    File.file?(file)
  end

  def write(file, contents)
    File.open(file, 'w') do |f|
      f.puts(contents)
    end
  end

  # Searches for a line in a text file.
  def line_exist?(file, line_to_find)
    found = false
    File.open(file).each do |line|
      found = line.strip == line_to_find
      break if found
    end

    found
  end
end

# Decorator for FileSystem that cancels out all operations that cause changes.
class DryRunFileSystemDecorator < SimpleDelegator
  def write(file, contents)
    puts "Would have created file #{file} with contents #{contents}"
  end
end

# Creates a new instance of FileSystem.
module FileSystemFactory
  def self.create(dry_run: false)
    if dry_run
      DryRunFileSystemDecorator.new(FileSystem.new)
    else
      FileSystem.new
    end
  end
end
