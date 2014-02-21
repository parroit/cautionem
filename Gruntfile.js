'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        watch: {
            test: {
                files: ['server/**/*.js'],
                tasks: ['mochaTest'],
                options: {
                    spawn: true
                }
            },
            server: {
                files: ['server/lib/**/*.js'],
                tasks: ['express'],
                options: {
                    spawn: false
                }
            }
        },
        
        express: {

            server: {
                options: {
                    script: 'server/lib/server.js'
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['server/test/**/*.js']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-express-server');


    grunt.registerTask('server', ['express:server','watch:server']);
    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('watch-test', 'watch:test');


};