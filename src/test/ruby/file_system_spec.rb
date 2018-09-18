# frozen_string_literal: true

require_relative '../../main/ruby/file_system'

RSpec.describe FileSystem do
  before(:example) do
    @file_system = FileSystem.new
  end

  describe '#file?' do
    it 'should use the local file system' do
      expect(File).to receive(:file?)
        .with('C:/test.txt')
        .and_return(true)

      expect(@file_system.file?('C:/test.txt')).to be true
    end
  end

  describe '#write' do
    it 'should write the contents' do
      f = double('file')
      expect(File).to receive(:open)
        .with('C:/test.txt', 'w')
        .and_yield(f)
        .and_return(42)
      expect(f).to receive(:puts)
        .with('contents of the file')

      expect(
        @file_system.write('C:/test.txt', 'contents of the file')
      ).to eq(42)
    end
  end
end

RSpec.describe DryRunFileSystemDecorator do
  describe '#write' do
    it 'should just write to the console' do
      decorator = DryRunFileSystemDecorator.new('')
      expect(decorator).to receive(:puts)
        .with('Would have created file C:/test.txt with contents contents')
      decorator.write('C:/test.txt', 'contents')
    end
  end
end

RSpec.describe FileSystemFactory do
  describe '#create' do
    it 'should create a regular file system' do
      file_system = FileSystemFactory.new.create(dry_run: false)
      expect(file_system).to be_instance_of(FileSystem)
    end

    it 'should create a dry-run file system' do
      file_system = FileSystemFactory.new.create(dry_run: true)
      expect(file_system).to be_instance_of(DryRunFileSystemDecorator)
      expect(file_system.__getobj__).to be_instance_of(FileSystem)
    end
  end
end
