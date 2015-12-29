'use strict';
var exec = require('child_process').exec;

exports.pull = function(req, res) {
    execute(
        'git pull',
        function(callback){
            res.jsonp(callback);
        });
};

exports.install = function(req, res) {
    execute('npm install',
        function(callback){
            res.jsonp(callback);
    });
};

exports.build = function(req, res) {
    execute('grunt production',
    function(callback){
        res.jsonp(callback);
    });
};

exports.restart = function(req, res) {
    var output = ''
    execute('service uniwebex restart',
        function(callback1){
            if (callback1)
                output = output + callback1;
            res.jsonp(output);
    });
};


function execute(command, callback){
    var startMoment = (new Date()).toUTCString();
    exec(command,
        {
            encoding: 'utf8',
            timeout: 0,
            maxBuffer: 1024*1024,
            killSignal: 'SIGTERM',
            cwd: null,
            env: null
        },
        function(error, stdout, stderr){

            var stopMoment = (new Date()).toUTCString();

            var output = 'started: ' + startMoment;
            if (stdout)
                output = output + '\r\n\r\n' + stdout;

            if (stderr)
                output = output + '\r\n' + stderr;

            output = output + '\r\n\r\ncomplete: ' + stopMoment;


            callback(output);
        });
}


