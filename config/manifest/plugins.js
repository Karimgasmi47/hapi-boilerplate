'use strict';

const async     = require('async');
const envConfig = require('../environments/all');

module.exports.init = server => (
    new Promise((resolve, reject) => {
        async.series({
            good(done) {
                server.register({
                    register : require('good'),
                }, done);
            },
            innert(done) {
                server.register({
                    register : require('inert'),
                }, done);
            },
            vision(done) {
                server.register({
                    register : require('vision'),
                }, done);
            },
            hapiswagger(done) {
                server.register({
                    register : require('hapi-swagger'),
                }, done);
            },
            blipp(done) {
                server.register({
                    register : require('blipp'),
                    options  : {
                        showStart : envConfig.log.showRouteAtStart,
                        showAuth  : true,
                    },
                }, done);
            },
            boom(done) {
                server.register({
                    register : require('hapi-boom-decorators'),
                }, done);
            },
            user(done) {
                server.register({
                    register : require('../../app/plugins/user'),
                }, done);
            },
        }, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    })
);
