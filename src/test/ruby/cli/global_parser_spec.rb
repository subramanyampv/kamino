# frozen_string_literal: true

require_relative '../../../main/ruby/cli/global_parser'

# Dummy sub-command parser for this unit test file.
class DummyParser
  def name
    'dummy'
  end

  def help
    'dummy help'
  end

  def parse(argv)
    { dummy: argv }
  end
end

RSpec.describe CLI::GlobalParser do
  describe 'with dummy parser' do
    before(:example) do
      @parser = CLI::GlobalParser.new([DummyParser.new])
    end

    describe '#parse' do
      it 'should parse command without extra arguments' do
        result = @parser.parse(['dummy'])
        expect(result).to eq(
          command: :dummy,
          dummy: []
        )
      end

      it 'should parse command with extra arguments' do
        result = @parser.parse(['dummy', '--oops'])
        expect(result).to eq(
          command: :dummy,
          dummy: ['--oops']
        )
      end

      it 'should recognize dry-run' do
        result = @parser.parse(['--dry-run', 'dummy'])
        expect(result).to eq(
          command: :dummy,
          dummy: [],
          dry_run: true
        )
      end

      it 'should throw on missing command' do
        expect { @parser.parse([]) }.to raise_error(
          OptionParser::MissingArgument, /No command specified/
        )
      end

      it 'should throw on wrong command' do
        expect { @parser.parse(['createee']) }.to raise_error(
          OptionParser::InvalidOption, /Unknown command createee/
        )
      end
    end
  end

  describe 'with real parsers' do
    before(:example) do
      @parser = CLI::GlobalParser.new
    end

    it 'should parse create repo' do
      options = @parser.parse([
                                'create', '-nname', '-oowner',
                                '-pgithub', '-uusername',
                                '--password', 'secret'
                              ])
      expect(options).to eq(
        command: :create,
        name: 'name',
        owner: 'owner',
        password: 'secret',
        provider: :github,
        username: 'username'
      )
    end
  end
end
