'use strict';

var repositoryImpl = require('../models/repository');

exports.find = function(req, res) {
    repositoryImpl
        .find(req.body.name, function(instances, error){
            if (error)
                res.status(500).send({ error: error, message: error.message });
            else{
                if (!instances)
                    instances = [];

                res.send(instances);
            }
        });
};

exports.get = function(req, res) {
    repositoryImpl
        .get(req.body.id, function(instance, error){
            if (error)
                res.status(500).send({ error: error, message: error.message });
            else{
                res.send(instance ? instance.toJson() : null);
            }
        });
};

exports.update = function(req, res) {
    repositoryImpl
        .update(req.body.id, req.body.name, req.body.location, req.body.isOpen, function(instance, error){
            if (error)
                res.status(500).send({ error: error, message: error.message });
            else{
                res.send(instance ? instance.toJson() : null);
            }
        });
};

exports.create = function(req, res) {
    repositoryImpl
        .create(req.body.name, req.body.location, req.body.isOpen, function(instance, error){
            if (error)
                res.status(500).send({ error: error, message: error.message });
            else{
                res.send(instance ? instance.toJson() : null);
            }
        });
};

exports.delete = function(req, res) {
    repositoryImpl
        .delete(req.body.id, function(result, error){
            if (error)
                res.status(500).send({ error: error, message: error.message });
            else{
                res.send(result);
            }
        });
};


