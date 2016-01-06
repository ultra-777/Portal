'use strict';

var repositoryImpl = require('../models/repository');

exports.find = function(req, res) {
    checkAuthorization(req, res, function() {
        repositoryImpl
            .find(req.body.name, function (instances, error) {
                if (error)
                    res.status(500).send({error: error, message: error.message});
                else {
                    if (!instances)
                        instances = [];

                    res.send(instances);
                }
            });
    });
};

exports.get = function(req, res) {
    checkAuthorization(req, res, function() {
        repositoryImpl
            .get(req.body.id, function (instance, error) {
                if (error)
                    res.status(500).send({error: error, message: error.message});
                else {
                    res.send(instance ? instance.toJson() : null);
                }
            });
    });
};

exports.update = function(req, res) {
    checkAuthorization(req, res, function() {
        repositoryImpl
            .update(req.body.id, req.body.name, req.body.location, req.body.isOpen, function (instance, error) {
                if (error)
                    res.status(500).send({error: error, message: error.message});
                else {
                    res.send(instance ? instance.toJson() : null);
                }
            });
    });
};

exports.create = function(req, res) {
    checkAuthorization(req, res, function() {
        repositoryImpl
            .create(req.body.name, req.body.location, req.body.isOpen, function (instance, error) {
                if (error)
                    res.status(500).send({error: error, message: error.message});
                else {
                    res.send(instance ? instance.toJson() : null);
                }
            });
    });
};

exports.delete = function(req, res) {
    checkAuthorization(req, res, function() {
        repositoryImpl
            .delete(req.body.id, function (result, error) {
                if (error)
                    res.status(500).send({error: error, message: error.message});
                else {
                    res.send(result);
                }
            });
    });
};

function checkAuthorization(req, res, callback/*function()*/){
    var roles = (req.user && req.user.roles) ? req.user.roles : [];
    var isAdmin = false;
    var i = roles.length;
    while (i--) {
        var candidate = roles[i];
        if (candidate && (candidate.name == 'admin')) {
            isAdmin = true;
            break;
        }
    }

    if (isAdmin) {
        callback && callback();
    }
    else {
        res.status(401).send({message: 'User is not administrator'});
    }
}


