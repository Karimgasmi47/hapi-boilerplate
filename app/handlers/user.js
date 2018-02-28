'use strict';
const User = require('../models/user');
const Boom = require('boom');
const faker = require('Faker');





module.exports.generateUsers = (request, response) => {
    for (let i = 0; i < 100; i++) {
        const UserFaker = {
            login     : faker.Name.findName(),
            email     : faker.Internet.email(),
            password  : faker.PhoneNumber.phoneNumber(),
            firstname : faker.Name.firstName(),
            lastname  : faker.Name.lastName(),
            company   : faker.Name.lastName(),
            function  : faker.Name.lastName(),
        };
        const user = request.server.plugins.user;

        user.postUser(UserFaker);
    }
    response('ok').code(201);
};

module.exports.getUsers = (request, response) => {
    const user = request.server.plugins.user;
    user.getUsers().then(
        (user) => {
            response(user).code(201);
        }
    ).catch((err) => {
        response(err);
    })
    ;
};

module.exports.resetPasswordUsers = (request, response) => {
    const user = request.server.plugins.user;
    console.log(request.params.id);
    user.resetPassword(request.params.id).then(
        (user) => {
            response(user).code(201);
        }
    )
    ;
};


module.exports.postUsers = (request, response) => {
    const user = request.server.plugins.user;

    user.postUser(request.payload).then(
        (user) => {
            response(user);
        });
};

module.exports.getUserById = (request, response) => {
    const user = request.server.plugins.user;

    user.getUser(request.params.id).then(
        (user) => {
            response(user);
        }
    ).catch((err) => {
        response(err);
    })
    ;
};

module.exports.deleteUsers = (request, response) => {
    const user = request.server.plugins.user;

    user.deleteUser(request.params.id).then(
        (user) => {
            response(user).code(201);
        }
    );
};

module.exports.putUsers = (request, response) => {
    const user = request.server.plugins.user;
    
    user.putUser(request.params.id,request.payload).then(
        (user) => {
            response(user).code(201);
        }).catch((err) => {
        response(err);
    }
    );
};

module.exports.authUsers = (request, response) => {
    const user = request.server.plugins.user;

    user.authUser(request.payload).then(
        (user) => {
            response(user).code(201);
        }).catch((err) => {
        response(err);
    }
    );
};
