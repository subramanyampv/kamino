# frozen_string_literal: true

require 'shell'

RSpec.describe Shell do
  before(:example) do
    @shell = Shell.new
  end

  describe('#system') do
    it('should succeed on a simple command') do
      @shell.system 'echo hello'
    end

    it('should support chdir') do
      @shell.system 'echo hello', chdir: '..'
    end

    it('should fail on a missing command') do
      expect do
        @shell.system 'a-command-that-should-not-exist'
      end.to raise_error(/Error running a-command-that-should-not-exist/)
    end

    it('should fail when chdir is nil') do
      expect do
        @shell.system 'echo hello', chdir: nil
      end.to raise_error(ArgumentError, /empty chdir/)
    end

    it('should fail when chdir is empty') do
      expect do
        @shell.system 'echo hello', chdir: ''
      end.to raise_error(ArgumentError, 'empty chdir')
    end
  end

  describe('#backticks') do
    it('should succeed on a simple command') do
      result = @shell.backticks 'echo hello'
      expect(result).to eq('hello')
    end

    it('should fail on a missing command') do
      expect do
        @shell.backticks 'a-command-that-should-not-exist'
      end.to raise_error(/No such file or directory/)
    end

    it('should support chdir') do
      result = @shell.backticks 'echo hello', chdir: '..'
      expect(result).to eq('hello')
    end
  end
end
