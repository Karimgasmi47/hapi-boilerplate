'use strict';

const jsonToMongoose    = require('json-mongoose');
const mongoose          = require('k7-mongoose').mongoose();
const async             = require('async');
const encrypt           = require('@karimgasmi47/iut-encrypt');

module.exports = jsonToMongoose({
    mongoose,
    collection  : 'user',
    schema      : require('../schemas/user'),
    pre         : {
        save : (doc, next) => {
            async.parallel({
                password : (done) => {
                    doc.password = encrypt.sha1(doc.password)
                    done();
                },
            }, next);
        },
    },
    schemaUpdate : (schema) => {
        schema.login.unique  = true;
        schema.email.unique  = true;

        return schema;
    },
    transform : (doc, ret, options) => {
        delete ret.password;

        return ret;
    },
});
