const chai = require('chai');
const expect = chai.expect;
const filenameConvert = require('../app/filename_convert');

describe('filename_convert', () => {
    const patterns = [
        ['_gitignore', '.gitignore'],
        ['_travis.yml', '.travis.yml'],
        ['README.md', 'README.md'],
        ['app/index.js', 'app/index.js'],
        ['app/_gitignore', 'app/.gitignore'],
        ['docfx_project/toc.yml', 'docfx_project/toc.yml'],
        ['docfx_project/_gitignore', 'docfx_project/.gitignore'],
        ['MyLib.sln', 'SomeLib.sln']
    ];

    const options = {
        name: 'SomeLib'
    };

    patterns.forEach(pattern => {
        it(`should map ${pattern[0]} to ${pattern[1]}`, () => {
            const input = pattern[0];
            const expected = pattern[1];
            const actual = filenameConvert(input, options);
            expect(actual).to.equal(expected);
        });
    });
});
