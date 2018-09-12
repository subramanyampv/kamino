# Wrapper for Kernel.` and Kernel.system for easier unit testing
class Shell
  def backticks(cmd, chdir: '')
    if chdir && !chdir.empty?
      Dir.chdir(chdir) do
        do_backticks cmd
      end
    else
      do_backticks cmd
    end
  end

  def system(cmd, chdir: '.')
    raise ArgumentError, 'empty chdir' if !chdir || chdir.empty?
    raise "Error running #{cmd}" unless Kernel.system(
      cmd, chdir: chdir
    )
  end

  private

  # rubocop:disable Style/SpecialGlobalVars
  def do_backticks(cmd)
    result = `#{cmd}`
    result.strip if $?.success? # otherwise it returns nil
  end
  # rubocop:enable Style/SpecialGlobalVars
end
