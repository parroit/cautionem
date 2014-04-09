"use strict";

module.exports = function(grunt) {

    var browsers = [{
        browserName: "firefox",
        platform: "Windows 7",
        version: "28"
    },{
        browserName: "firefox",
        platform: "linux",
        version: "28"
    }, {
        browserName: "chrome",
        platform: "linux",
        version: "33"
    }, {
        browserName: "chrome",
        platform: "Windows 7",
        version: "33"
    }, {
        browserName: "internet explorer",
        platform: "Windows 7",
        version: "11"
    }, {
        browserName: "internet explorer",
        platform: "Windows 7",
        version: "10"
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
                    concurrency: 1,
                    browsers: browsers,
                    testname: "mocha tests",
                    tags: ["master"]
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    timeout: 120000,
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
    grunt.registerTask("test", ["mochaTest","express:server","saucelabs-mocha"]);
    grunt.registerTask("test-client", ["express:server","saucelabs-mocha"]);
    grunt.registerTask("watch-test", "watch:test");


};