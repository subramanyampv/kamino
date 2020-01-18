require "yaml"

def switch_to_openjdk(working_dir)
  filename = File.join(working_dir, ".travis.yml")
  if File.exist?(filename)
    data = YAML.load(File.read(filename))
    if data["jdk"] == "oraclejdk8"
      data["jdk"] = "openjdk8"
      File.write(filename, data.to_yaml)
      return true
    end
  end
end
