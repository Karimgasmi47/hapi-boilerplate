'use strict';
const User = require('../models/user');

module.exports.root = (request, response) => {
    response(null,  {
        result : 'vous êtes connectés',
    });
};


