'use strict';
var exec = require('child_process').exec;


exports.reboot = function(req, res) {
    execute('ls -a', function(callback){
        console.log(callback);
        res.jsonp(callback);
    });
};

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}


