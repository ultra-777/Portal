'use strict';
var exec = require('child_process').exec;

exports.pull = function(req, res) {
    execute(
        'git pull',
        {
            encoding: 'utf8',
            timeout: 0,
            maxBuffer: 1024*1024,
            killSignal: 'SIGTERM',
            cwd: null,
            env: null
        },
        function(callback){
            console.log(callback);
            res.jsonp(callback);
        });
};

exports.install = function(req, res) {
    execute('npm install', function(callback){
        console.log(callback);
        res.jsonp(callback);
    });
};

exports.build = function(req, res) {
    execute('grunt production', function(callback){
        console.log(callback);
        res.jsonp(callback);
    });
};

exports.restart = function(req, res) {
    execute('restart uniwebex', function(callback){
        console.log(callback);
        res.jsonp(callback);
    });
};

exports.reboot = function(req, res) {
    execute('ls -a', function(callback){
        console.log(callback);
        res.jsonp(callback);
    });
};

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}


