# frozen_string_literal: true

# Creates command handler instances
module Commands
  def self.create_command(options)
    command_name = options[:command]
    file_name = command_name.tr('-', '_') + '_repo_command'
    require_relative file_name
    class_name = file_name.split('_').collect(&:capitalize).join
    # get the class
    clazz = Commands.const_get(class_name)
    clazz.new(options)
  end
end
