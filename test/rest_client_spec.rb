# frozen_string_literal: true

require 'basic_auth'
require 'rest_client'

RSpec.describe RestClient do
  before(:example) do
    @rest_client = RestClient.new
  end

  describe('#get') do
    it('should get') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:basic_auth).with('user', 'password')
      allow(req).to receive(:content_type=).with('application/json')

      allow(Net::HTTP::Get).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPCreated.new(nil, 201, '')
      allow(res).to receive(:body).and_return('{"test":42}')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act
      result = @rest_client.get(
        'https://api.github.com/user/repos',
        basic_auth: BasicAuth.new('user', 'password')
      )

      # assert
      expect(result).to eq('test' => 42)
    end

    it('should get with nil basic auth') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')

      allow(Net::HTTP::Get).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPCreated.new(nil, 201, '')
      allow(res).to receive(:body).and_return('{"test":42}')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act
      result = @rest_client.get(
        'https://api.github.com/user/repos'
      )

      # assert
      expect(result).to eq('test' => 42)
    end

    it('should get with empty basic auth') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')

      allow(Net::HTTP::Get).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPCreated.new(nil, 201, '')
      allow(res).to receive(:body).and_return('{"test":42}')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act
      result = @rest_client.get(
        'https://api.github.com/user/repos',
        basic_auth: BasicAuth.new('', '')
      )

      # assert
      expect(result).to eq('test' => 42)
    end

    it('should throw on 404') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')

      allow(Net::HTTP::Get).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPNotFound.new(nil, 404, '')
      allow(res).to receive(:body).and_return('{"test":42}')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act and assert
      expect do
        @rest_client.get(
          'https://api.github.com/user/repos',
          basic_auth: BasicAuth.new('', '')
        )
      end.to raise_error(RestClientError)
    end
  end

  describe('#post') do
    it('should post with nil basic auth') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')
      allow(req).to receive(:body=).with('{"toast":"light"}')

      allow(Net::HTTP::Post).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPCreated.new(nil, 201, '')
      allow(res).to receive(:body).and_return('{"test":42}')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act
      result = @rest_client.post(
        'https://api.github.com/user/repos',
        toast: 'light'
      )

      # assert
      expect(result).to eq('test' => 42)
    end

    it('should post with extra headers') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')
      allow(req).to receive(:body=).with('{"toast":"light"}')
      allow(req).to receive(:[]=).with('Token', 'Secret')

      allow(Net::HTTP::Post).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPCreated.new(nil, 201, '')
      allow(res).to receive(:body).and_return('{"test":42}')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act
      result = @rest_client.post(
        'https://api.github.com/user/repos',
        { toast: 'light' },
        headers: {
          'Token' => 'Secret'
        }
      )

      # assert
      expect(result).to eq('test' => 42)
    end

    it('should post with empty body') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')

      allow(Net::HTTP::Post).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPCreated.new(nil, 201, '')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)
      allow(res).to receive(:body).and_return('{"test":42}')

      # act
      result = @rest_client.post(
        'https://api.github.com/user/repos',
        ''
      )

      # assert
      expect(result).to eq('test' => 42)
    end

    it('should post with nil body') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')

      allow(Net::HTTP::Post).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPCreated.new(nil, 201, '')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)
      allow(res).to receive(:body).and_return('{"test":42}')

      # act
      result = @rest_client.post(
        'https://api.github.com/user/repos',
        nil
      )

      # assert
      expect(result).to eq('test' => 42)
    end
  end

  describe('#put') do
    it('should put with empty response body') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')
      allow(req).to receive(:body=).with('{"toast":"light"}')

      allow(Net::HTTP::Put).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPSuccess.new(nil, 200, '')
      allow(res).to receive(:body).and_return('')

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act
      result = @rest_client.put(
        'https://api.github.com/user/repos',
        toast: 'light'
      )

      # assert
      expect(result).to be_nil
    end
  end

  describe('#delete') do
    it('should delete with nil response body') do
      # arrange
      uri = URI('https://api.github.com/user/repos')

      req = double('req')
      allow(req).to receive(:content_type=).with('application/json')
      allow(req).to receive(:body=).with('')

      allow(Net::HTTP::Delete).to receive(:new).with(uri).and_return(req)

      res = Net::HTTPSuccess.new(nil, 200, '')
      allow(res).to receive(:body).and_return(nil)

      http = double('http')
      allow(http).to receive(:request).with(req)

      allow(Net::HTTP).to receive(:start)
        .with('api.github.com', 443, use_ssl: true)
        .and_yield(http)
        .and_return(res)

      # act
      result = @rest_client.delete(
        'https://api.github.com/user/repos'
      )

      # assert
      expect(result).to be_nil
    end
  end
end
