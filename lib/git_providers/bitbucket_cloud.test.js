const { expect } = require('chai');
const sinon = require('sinon');
const bitbucketCloud = require('./bitbucket_cloud');
const httpsPromise = require('../https_promise');
const optionsParser = require('../options_parser');
const { expectAsyncError } = require('../../test-utils');

function assertBasicAuth(username, password) {
  const auth = httpsPromise.request.getCall(0).args[1].headers.Authorization;
  expect(!!auth).to.be.true;
  expect(auth.indexOf('Basic ')).to.equal(0);
  const buffer = Buffer.from(auth.split(' ')[1], 'base64');
  expect(buffer.toString('utf8')).to.eql(`${username}:${password}`);
}

describe('bitbucket_cloud', () => {
  beforeEach(() => {
    sinon.stub(optionsParser);
    sinon.stub(httpsPromise);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should fetch repositories from Bitbucket Cloud', async () => {
    // arrange
    const options = {
      owner: 'ngeor',
      username: 'user1',
      password: 'test123',
    };
    optionsParser.get.returns(options);

    const bitbucketResponse1 = {
      next: 'https://api.bitbucket.org/page2',
      values: [
        {
          slug: 'my-project',
          links: {
            clone: [
              {
                name: 'https',
                href: 'https://something',
              },
              {
                name: 'ssh',
                href: 'ssh://something',
              },
            ],
          },
        },
      ],
    };

    const bitbucketResponse2 = {
      values: [
        {
          slug: 'my-second-project',
          links: {
            clone: [
              {
                name: 'https',
                href: 'https://my-second-project',
              },
              {
                name: 'ssh',
                href: 'ssh://my-second-project',
              },
            ],
          },
        },
      ],
    };

    const requestOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'clone-all.js',
        Accept: 'application/json',
        Authorization: 'Basic dXNlcjE6dGVzdDEyMw==',
      },
    };

    httpsPromise.request.withArgs('https://api.bitbucket.org/2.0/repositories/ngeor', requestOptions).resolves({
      message: JSON.stringify(bitbucketResponse1),
    });

    httpsPromise.request.withArgs('https://api.bitbucket.org/page2', requestOptions).resolves({
      message: JSON.stringify(bitbucketResponse2),
    });

    const expectedRepositories = [
      {
        clone_url: 'https://something',
        ssh_url: 'ssh://something',
        name: 'my-project',
      },
      {
        clone_url: 'https://my-second-project',
        ssh_url: 'ssh://my-second-project',
        name: 'my-second-project',
      },
    ];

    // act
    const repositories = await bitbucketCloud.getRepositories();

    // assert
    expect(repositories).to.eql(expectedRepositories);
  });

  describe('password', () => {
    const options = {
      owner: 'ngeor',
      username: 'user1',
    };

    beforeEach(() => {
      httpsPromise.request.resolves({
        message: JSON.stringify({ values: [] }),
      });
    });

    describe('when BITBUCKET_PASSWORD is set', () => {
      beforeEach(() => {
        process.env.BITBUCKET_PASSWORD = 'secret';
      });

      afterEach(() => {
        process.env.BITBUCKET_PASSWORD = '';
      });

      describe('when password is provided at command line', () => {
        beforeEach(() => {
          options.password = 'test123';
          optionsParser.get.returns(options);
        });

        it('should use the cli password', async () => {
          await bitbucketCloud.getRepositories();
          assertBasicAuth(options.username, 'test123');
        });
      });

      describe('when password is not provided at command line', () => {
        beforeEach(() => {
          options.password = '';
          optionsParser.get.returns(options);
        });

        it('should use the env password', async () => {
          await bitbucketCloud.getRepositories();
          assertBasicAuth(options.username, 'secret');
        });
      });
    });

    describe('when BITBUCKET_PASSWORD is not set', () => {
      describe('when password is provided at command line', () => {
        beforeEach(() => {
          options.password = 'test123';
          optionsParser.get.returns(options);
        });

        it('should use the cli password', async () => {
          await bitbucketCloud.getRepositories();
          assertBasicAuth(options.username, 'test123');
        });
      });

      describe('when password is not provided at command line', () => {
        beforeEach(() => {
          options.password = '';
          optionsParser.get.returns(options);
        });

        it('should try to get repositories without authorization (public repositories)', async () => {
          await bitbucketCloud.getRepositories();
          expect(httpsPromise.request.getCall(0).args[1].headers.Authorization).to.be.undefined;
        });
      });
    });
  });

  describe('username', () => {
    const options = {
      owner: 'ngeor',
      password: 'secret',
    };

    beforeEach(() => {
      httpsPromise.request.resolves({
        message: JSON.stringify({ values: [] }),
      });
    });

    describe('when BITBUCKET_USERNAME is set', () => {
      beforeEach(() => {
        process.env.BITBUCKET_USERNAME = 'someone-else';
      });

      afterEach(() => {
        process.env.BITBUCKET_USERNAME = '';
      });

      describe('when username is provided at command line', () => {
        beforeEach(() => {
          options.username = 'someone';
          optionsParser.get.returns(options);
        });

        it('should use the cli username', async () => {
          await bitbucketCloud.getRepositories();
          assertBasicAuth('someone', options.password);
        });
      });

      describe('when username is not provided at command line', () => {
        beforeEach(() => {
          options.username = '';
          optionsParser.get.returns(options);
        });

        it('should use the env username', async () => {
          await bitbucketCloud.getRepositories();
          assertBasicAuth('someone-else', options.password);
        });
      });
    });

    describe('when BITBUCKET_USERNAME is not set', () => {
      describe('when username is provided at command line', () => {
        beforeEach(() => {
          options.username = 'test123';
          optionsParser.get.returns(options);
        });

        it('should use the cli username', async () => {
          await bitbucketCloud.getRepositories();
          assertBasicAuth('test123', options.password);
        });
      });

      describe('when username is not provided at command line', () => {
        beforeEach(() => {
          options.username = '';
          optionsParser.get.returns(options);
        });

        it('should try to get repositories without authorization (public repositories)', async () => {
          await bitbucketCloud.getRepositories();
          expect(httpsPromise.request.getCall(0).args[1].headers.Authorization).to.be.undefined;
        });
      });
    });
  });

  describe('owner', () => {
    it('should not accept missing owner', async () => {
      // arrange
      optionsParser.get.returns({});

      // act and assert
      await expectAsyncError(() => bitbucketCloud.getRepositories(), 'owner is mandatory for Bitbucket');
    });
  });
});
