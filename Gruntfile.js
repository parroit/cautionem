"use strict";

module.exports = function(grunt) {

    var browsers = [{
        browserName: "firefox",
        version: "19",
        platform: "XP"
    }, {
        browserName: "chrome",
        platform: "XP"
    }, {
        browserName: "chrome",
        platform: "linux"
    }, {
        browserName: "internet explorer",
        platform: "WIN8",
        version: "10"
    }, {
        browserName: "internet explorer",
        platform: "VISTA",
        version: "9"
    }];

    // Project configuration.
    grunt.initConfig({
        watch: {
            test: {
                files: ["server/**/*.js"],
                tasks: ["mochaTest"],
                options: {
                    spawn: true
                }
            },
            server: {
                files: ["server/lib/**/*.js"],
                tasks: ["express"],
                options: {
                    spawn: false
                }
            }
        },
        
        express: {

            server: {
                options: {
                    script: "server/lib/server.js"
                }
            }
        },
        "saucelabs-mocha": {
            all: {
                options: {
                    urls: ["http://localhost:3000/test/index.html"],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: browsers,
                    testname: "mocha tests",
                    tags: ["master"]
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: ["server/test/**/*.js"]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-express-server");
    grunt.loadNpmTasks("grunt-saucelabs");


    grunt.registerTask("server", ["express:server","watch:server"]);
    grunt.registerTask("test-server", "mochaTest");
    grunt.registerTask("test", ["mochaTest","express:server","saucelabs-mocha"]););
    grunt.registerTask("test-client", ["express:server","saucelabs-mocha"]);
    grunt.registerTask("watch-test", "watch:test");


};