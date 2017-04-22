var chai = require('chai');
var expect = chai.expect;

describe('options', () => {
    var options;

    beforeEach(() => {
        options = require('../../lib/options');
    });

    afterEach(() => {
        process.argv = [];
        delete process.env.CLONE_ALL_OWNER;
        delete process.env.CLONE_ALL_USERNAME;
        delete process.env.CLONE_ALL_PASSWORD;
    });

    describe('isDryRun', () => {
        it('should be false when --dry-run is missing', () => {
            expect(options.isDryRun()).to.be.false;
        });

        it('should be true when --dry-run is present', () => {
            process.argv.push('--dry-run');
            expect(options.isDryRun()).to.be.true;
        });
    });

    describe('isVerbose', () => {
        it('should be false when -v is missing', () => {
            expect(options.isVerbose()).to.be.false;
        });

        it('should be true when -v is present', () => {
            process.argv.push('-v');
            expect(options.isVerbose()).to.be.true;
        });
    });

    describe('getOwnerUsername', () => {
        it('should return empty string when --owner is missing', () => {
            expect(options.getOwnerUsername()).to.equal('');
        });

        it('should get the env variable CLONE_ALL_OWNER', () => {
            process.env['CLONE_ALL_OWNER'] = 'user123';
            expect(options.getOwnerUsername()).to.equal('user123');
        });

        it('should return the user when --owner=x is present', () => {
            process.argv.push('--owner=ngeor');
            expect(options.getOwnerUsername()).to.equal('ngeor');
        });

        it('should return the user when --owner=x and env variable are both present', () => {
            process.argv.push('--owner=ngeor');
            process.env['CLONE_ALL_OWNER'] = 'user123';
            expect(options.getOwnerUsername()).to.equal('ngeor');
        });
    });

    describe('getProvider', () => {
        it('should return empty string when --provider is missing', () => {
            expect(options.getProvider()).to.equal('');
        });

        it('should return the user when --provider=x is present', () => {
            process.argv.push('--provider=ngeor');
            expect(options.getProvider()).to.equal('ngeor');
        });
    });

    describe('getUsername', () => {
        it('should return empty string when --username is missing', () => {
            expect(options.getUsername()).to.equal('');
        });

        it('should get the env variable CLONE_ALL_USERNAME', () => {
            process.env['CLONE_ALL_USERNAME'] = 'user123';
            expect(options.getUsername()).to.equal('user123');
        });

        it('should return the user when --username=x is present', () => {
            process.argv.push('--username=ngeor');
            expect(options.getUsername()).to.equal('ngeor');
        });
    });

    describe('getPassword', () => {
        it('should return empty string when --password is missing', () => {
            expect(options.getPassword()).to.equal('');
        });

        it('should get the env variable CLONE_ALL_PASSWORD', () => {
            process.env['CLONE_ALL_PASSWORD'] = 'user123';
            expect(options.getPassword()).to.equal('user123');
        });

        it('should return the user when --password=x is present', () => {
            process.argv.push('--password=ngeor');
            expect(options.getPassword()).to.equal('ngeor');
        });
    });

    describe('isNoPagination', () => {
        it('should be false when --no-pagination is missing', () => {
            expect(options.isNoPagination()).to.be.false;
        });

        it('should be true when --no-pagination is present', () => {
            process.argv.push('--no-pagination');
            expect(options.isNoPagination()).to.be.true;
        });
    });

    describe('getOutputDirectory', () => {
        it('should return empty string when --output is missing', () => {
            expect(options.getOutputDirectory()).to.equal('');
        });

        it('should return the directory when --output=x is present', () => {
            process.argv.push('--output=../target/');
            expect(options.getOutputDirectory()).to.equal('../target/');
        });
    });

    describe('getBundleDirectory', () => {
        it('should return empty string when --bundle-dir is missing', () => {
            expect(options.getBundleDirectory()).to.equal('');
        });

        it('should return the directory when --bundle-dir=x is present', () => {
            process.argv.push('--bundle-dir=../target/');
            expect(options.getBundleDirectory()).to.equal('../target/');
        });
    });

    describe('getProtocol', () => {
        it('should return ssh when --protocol is missing', () => {
            expect(options.getProtocol()).to.equal('ssh');
        });

        it('should return the provided value when --protocol=x is present', () => {
            process.argv.push('--protocol=https');
            expect(options.getProtocol()).to.equal('https');
        });
    });

    describe('getSSHUsername', () => {
        it('should return empty string when --ssh-username is missing', () => {
            expect(options.getSSHUsername()).to.equal('');
        });

        it('should return the provided value when --ssh-username=x is present', () => {
            process.argv.push('--ssh-username=override');
            expect(options.getSSHUsername()).to.equal('override');
        });
    });
});
