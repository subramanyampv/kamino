module.exports = function(grunt) {
    grunt.initConfig({
        eslint: {
            default: [
                '*.js',
                'lib/**/*.js',
                'test/**/*.js'
            ],
            options: {
                fix: false
            }
        },

        mochaTest: {
            default: {
                src: 'test/**/*.js',
                options: {}
            }
        },

        mocha_istanbul: { // eslint-disable-line camelcase
            default: {
                src: 'test/**/*.js',
                options: {
                    excludes: ['Gruntfile.js'],
                    istanbulOptions: ['--include-all']
                }
            }
        },

        istanbul_check_coverage: { // eslint-disable-line camelcase
            default: {
                options: {
                    check: {
                        lines: 80,
                        statements: 80,
                        branches: 80,
                        functions: 80
                    }
                }
            }
        },

        watch: {
            default: {
                files: [
                    '*.js',
                    'lib/**/*.js',
                    'test/**/*.js'
                ],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        },

        coveralls: {
            default: {
                src: 'coverage/*.info'
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('default', [
        'eslint',
        'mochaTest',
        'mocha_istanbul',
        'istanbul_check_coverage']);
};
