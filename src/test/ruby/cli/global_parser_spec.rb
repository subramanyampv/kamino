# frozen_string_literal: true

require_relative '../../../main/ruby/cli/global_parser'

# Dummy sub-command parser for this unit test file.
class DummyParser
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
          command: 'dummy',
          dummy: []
        )
      end

      it 'should parse command with extra arguments' do
        result = @parser.parse(['dummy', '--oops'])
        expect(result).to eq(
          command: 'dummy',
          dummy: ['--oops']
        )
      end

      it 'should recognize dry-run' do
        result = @parser.parse(['--dry-run', 'dummy'])
        expect(result).to eq(
          command: 'dummy',
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

    describe 'create command' do
      valid_options = [
        'create', '-nname', '-oowner', '-pgithub', '-uusername',
        '--password', 'secret'
      ]

      it 'should parse create command with short options' do
        options = @parser.parse(valid_options)
        expect(options[:command]).to eq('create')
      end

      required_parameters = ['-n', '-o', '-p', '-u']
      required_parameters.each do |field|
        it "should require #{field} parameter" do
          options = valid_options.reject { |item| item.start_with?(field) }
          expect do
            @parser.parse(options)
          end.to raise_error(OptionParser::MissingArgument)
        end
      end
    end

    describe 'init command' do
      valid_options = [
        'init',
        '-nname',
        '-oowner',
        '-pbitbucket',
        '-uusername',
        '--password',
        'secret',
        '--description',
        'some fancy repo',
        '-ljava',
        '--clone-dir',
        'C:/tmp'
      ]
      it 'should parse init command with short options' do
        options = @parser.parse(valid_options)
        expect(options[:command]).to eq('init')
      end
    end

    describe 'delete command' do
      valid_options = [
        'delete',
        '-nname',
        '-oowner',
        '-pbitbucket',
        '-uusername',
        '--password',
        'secret'
      ]
      it 'should parse delete command with short options' do
        options = @parser.parse(valid_options)
        expect(options[:command]).to eq('delete')
      end
    end

    describe 'activate bitbucket pipelines command' do
      valid_options = [
        'activate-bitbucket-pipelines',
        '-nname',
        '-oowner',
        '-pbitbucket',
        '-uusername',
        '--password',
        'secret'
      ]
      it 'should parse activate bitbucket pipelines with short options' do
        options = @parser.parse(valid_options)
        expect(options[:command]).to eq('activate-bitbucket-pipelines')
      end
    end

    describe 'deactivate bitbucket pipelines command' do
      valid_options = [
        'deactivate-bitbucket-pipelines',
        '-nname',
        '-oowner',
        '-pbitbucket',
        '-uusername',
        '--password',
        'secret'
      ]
      it 'should parse deactivate bitbucket pipelines with short options' do
        options = @parser.parse(valid_options)
        expect(options[:command]).to eq('deactivate-bitbucket-pipelines')
      end
    end

    describe 'activate travis command' do
      valid_options = [
        'activate-travis',
        '-nname',
        '-oowner',
        '-ttoken'
      ]
      it 'should parse activate travis command with short options' do
        options = @parser.parse(valid_options)
        expect(options[:command]).to eq('activate-travis')
      end
    end

    describe 'deactivate travis command' do
      valid_options = [
        'deactivate-travis',
        '-nname',
        '-oowner',
        '-ttoken'
      ]
      it 'should parse deactivate travis command with short options' do
        options = @parser.parse(valid_options)
        expect(options[:command]).to eq('deactivate-travis')
      end
    end
  end
end
