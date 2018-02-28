'use strict';

const handler = require('../handlers/user');
const schema = require('../schemas/user');
const credentialsSchema = require('../schemas/login');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);



exports.register = (server, options, next) => {
    server.route([
        {
            method : 'GET',
            path   : '/users',
            config : {
                description : 'Afficher users',
                notes       : 'Afficher users',
                tags        : ['api'],
                handler     : handler.getUsers,
            },
        },
        {
            method : 'GET',
            path   : '/users/{id}',
            config : {
                description : 'Afficher user',
                notes       : 'Afficher user',
                tags        : ['api'],
                handler     : handler.getUserById,
                validate    : {
                    params : {
                        id : Joi.objectId(),
                    },
                },
            },

        },
        {
            method : 'POST',
            path   : '/users',
            config : {
                description : 'Inserer user',
                notes       : 'Inserer user',
                tags        : ['api'],
                handler     : handler.postUsers,
                validate    : {
                    payload : schema,
                },
            },

        },
        {
            method : 'GET',
            path   : '/users/generate',
            config : {
                description : 'Inserer 100 users',
                notes       : 'Inserer 100 users',
                tags        : ['api'],
                handler     : handler.generateUsers,
            },

        },
        {
            method : 'PUT',
            path   : '/users/{id}',
            config : {
                description : 'Modifier User',
                notes       : 'Modif user',
                tags        : ['api'],
                handler     : handler.putUsers,
                validate    : {
                    payload : schema,
                    params  : {
                        id : Joi.objectId(),
                    },
                },
            },
        },
        {
            method : 'DELETE',
            path   : '/users/{id}',
            config : {
                description : 'Supprimer User',
                notes       : 'Route par défaut du projet',
                tags        : ['api'],
                handler     : handler.deleteUsers,
                validate    : {
                    params  : {
                        id : Joi.objectId(),
                    },
                },
            },
        },
        {
            method : 'POST',
            path   : '/authent',
            config : {
                description : 'Authentification',
                notes       : 'Authentification',
                tags        : ['api'],
                handler     : handler.authUsers,
                validate    : {
                    payload : credentialsSchema,
                },
            },
        },
        {
            method : 'POST',
            path   : '/reset/{id}',
            config : {
                description : 'Reset password',
                notes       : 'Reset password',
                tags        : ['api'],
                handler     : handler.resetPasswordUsers,
                validate    : {
                    params  : {
                        id : Joi.objectId(),
                    },
                },
            },
        },
    ]);
    next();
};

exports.register.attributes = {
    name : 'user-routes',
};
