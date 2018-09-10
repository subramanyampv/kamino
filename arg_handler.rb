# Parses arguments passed directly to the CLI
class ArgHandler
  def initialize(options)
    @options = options
  end

  def parse(argv)
    @state = :needs_key
    @last_key = nil
    @values = {}

    argv.each do |arg|
      parse_arg arg
    end

    raise "Missing argument for --#{@last_key}" if @state == :needs_value
    @values
  end

  private

  def parse_arg(arg)
    if @state == :needs_key
      parse_arg_key arg
    elsif @state == :needs_value
      parse_arg_value arg
    else
      raise 'Unexpected state'
    end
  end

  def parse_arg_key(arg)
    # ensure it starts with '--'
    @last_key = arg[2..arg.length - 1].to_sym
    option = @options[@last_key]
    unless option
      puts "Unknown argument #{arg}"
      exit 1
    end

    show_help_and_exit if option[:help]

    @state = :needs_value
  end

  def parse_arg_value(arg)
    @values[@last_key] = arg
    @state = :needs_key
    @last_key = nil
  end

  def show_help_and_exit
    help
    exit
  end

  def help
    puts 'instarepo!'
    @options.each do |flag, v|
      puts "--#{flag}\t#{v[:description]}"
    end
  end
end
