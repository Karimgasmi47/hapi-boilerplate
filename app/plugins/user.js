'use strict';

const	Promise			=	require('bluebird');
const Boom = require('boom');
const encrypt = require('@karimgasmi47/iut-encrypt');
const mailService = require('../handlers/mail');


//	contient	toutes	les	méthodes	privées	de	votre	plugin
const	internals	=	{};
const	externals	=	{
    getUsers()	{
        return	new	Promise((resolve,	reject)	=>	{
            internals.server.database.user.find((err, users) => resolve(users));
        });
    },
    getUser(id)    {
        return	new	Promise((resolve,	reject)	=>	{
            internals.server.database.user.findById(id,(
                (err, user) => {
                    if (!user) {
                        reject(new Boom.notFound('user not found'));
                    }
                    resolve(user);
                }));
        });
    },
    putUser(id,payload)    {
        const originUser = internals.server.database.user.findById(id);

        return	new	Promise((resolve,	reject)	=>	{
            internals.server.database.user.findById(id,(
                (err, user) => {
                    if (!user) {
                        reject(new Boom.notFound('user not found'));
                    } else {
                        user.set(payload);
                        user.save((err, updatedUser) => {
                            if (!updatedUser) {
                                reject(err);
                            }

                            mailService.sendEmailUpdate(internals.server.app.envs.mailConfig.auth, payload);

                            resolve(updatedUser);
                        });
                    }
                }));
        });
    },
    postUser(payload)    {
        const user = new internals.server.database.user(payload);
        return	new	Promise((resolve,	reject)	=>	{
            user.save(((err, user) => {
                if (err) {
                    reject(err);
                }
                mailService.sendEmailNewUser(internals.server.app.envs.mailConfig.auth, payload);
                resolve(user);
            }));
        });
    },
    deleteUser(id) {
        const user = internals.server.database.user.findById(id);

        return	new	Promise((resolve,	reject)	=>	{
            if (!user.id) {
                reject(new Boom.notFound('user not found'));
            }
            user.remove((err, user) => {
                if (err) {
                    reject(new Boom.badRequest('erreur interne'));
                }
                resolve('User deleted');
            });
        });
    },
    authUser(payload) {
        const user = internals.server.database.user;
        const credentials = payload;

        return	new	Promise((resolve,	reject)	=>	{
            internals.server.database.user.findOne({ login : credentials.login },(
                (err, user) => {
                    if (!user) {
                        reject(new Boom.notFound('user not found'));
                    } else if (err) {
                        reject(new Boom.badRequest('Erreur interne'));
                    } else {
                        credentials.password = encrypt.sha1(credentials.password);

                        if (user.password === credentials.password) {
                            resolve('Vous êtes connecté !');
                        } else {
                            reject(new Boom.unauthorized('Bad credentials'));
                        }
                    }
                }));
        });
    },
    resetPassword(id) {
        const randomString = function (length) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

        return	new	Promise((resolve,	reject)	=>	{
            internals.server.database.user.findById(id,(
                (err, user) => {
                    if (!user) {
                        reject(new Boom.notFound('user not found'));
                    } else if (err) {
                        reject(new Boom.badRequest('Erreur interne'));
                    } else {
                        const newPassword = randomString(8);
                        user.password = encrypt.sha1(newPassword);

                        mailService.sendEmailNewPassword(internals.server.app.envs.mailConfig.auth, user, newPassword);

                        user.save().then((saved) => {
                            resolve(null, 'Nouveau mot de passe généré');
                        }).catch((err) => {
                            reject(new Boom.badRequest('Erreur interne'));
                        });
                    }
                }));
        });
    },

    register(server,	options,	next)	{
        internals.server		=	server.root;
        internals.settings		=	options;
        //	à	répéter	autant	de	fois
        //	que	vous	avez	de	méthodes	publiques
        server.expose('getUsers',	externals.getUsers);
        server.expose('getUser',	externals.getUser);
        server.expose('postUser',	externals.postUser);
        server.expose('deleteUser',	externals.deleteUser);
        server.expose('putUser',	externals.putUser);
        server.expose('authUser',	externals.authUser);
        server.expose('resetPassword',	externals.resetPassword);
        next();
    },
};
externals.register.attributes	=	{
    name    :	'user',
};
module.exports.register	=	externals.register;
