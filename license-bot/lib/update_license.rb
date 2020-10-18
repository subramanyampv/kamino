def update_license(line, year)
  if line.start_with?("Copyright (c) ")
    r = /(?<start_year>[0-9]{4})(\-(?<end_year>[0-9]{4}))?/
    match = r.match(line)
    if match && ((match[:end_year] && match[:end_year] != year) || (match[:start_year] != year))
      return line.gsub(r, "#{match[:start_year]}-#{year}")
    end
  end
  line
end

def update_license_lines(lines, year)
  has_changes = false
  new_lines = lines.map do |line|
    new_line = update_license(line, year)
    has_changes = has_changes || new_line != line
    new_line
  end
  [new_lines, has_changes]
end

def update_license_file(dir)
  filename = File.join(dir, "LICENSE")
  if File.exist?(filename)
    lines = File.readlines(filename)
    new_lines, has_changes = update_license_lines(lines, Time.now.year.to_s)
    if has_changes
      open(filename, "w") do |f|
        new_lines.each { |line| f.puts(line) }
      end
    end

    has_changes
  end
end
