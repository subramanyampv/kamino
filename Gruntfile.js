module.exports = function(grunt) {
    grunt.initConfig({
        mochaTest: {
            default: {
                src: 'test/**/*.js',
                options: {
                }
            }
        },

        mocha_istanbul: {
            default: {
                src: 'test/**/*.js',
                options: {
                    istanbulOptions: ['--include-all']
                }
            }
        },

        istanbul_check_coverage: {
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
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['mochaTest', 'mocha_istanbul', 'istanbul_check_coverage']);
};
