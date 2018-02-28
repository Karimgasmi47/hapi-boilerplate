'use strict';

const nodeMailer = require('nodemailer');
const mailGen    = require('mailgen');




module.exports.sendEmailNewUser = (config, user) => {
    const email = {
        body : {
            name  : `${user.firstname} ${user.lastname}`,
            intro : 'Bienvenue sur cette superbe application créée avec HAPI.',
            outro : [`Votre login : ${user.login}`, ` et votre mot de passe : ${user.password}`],
        },

    };

    return sendMail(config, user.email, email);
};


module.exports.sendEmailNewPassword = (config, user, newPassword) => {
    const email = {
        body : {
            name  : `${user.firstname} ${user.lastname}`,
            intro : 'Votre mot de passe a été réinitialisé',
            outro : `Nouveau mot de passe : ${newPassword}`,
        },
    };

    return sendMail(config, user.email, email);
};


module.exports.sendEmailUpdate = (config, user) => {
    const email = {
        body : {
            name  : `${user.firstname} ${user.lastname}`,
            intro : 'Vos informations ont été modfiées',
            outro : [`Votre login : ${user.login}`, ` et votre mot de passe : ${user.password}`],
        },
    };

    return sendMail(config, user.email, email);
};


const sendMail = function (config, destinataire, emailGenerate) {
    const mailGenerator = new mailGen({
        theme   : 'default',
        product : {
            name : 'HAPI',
            link : 'http://localhost:8080/documentation',
        },
    });

    const smtpTransport = nodeMailer.createTransport({
        service : 'Gmail',
        auth    : {
            user : config.user,
            pass : config.password,
        },
    });

    const mail = {
        from    : config.user,
        to      : destinataire,
        subject : 'Mail HAPI',
        text    : mailGenerator.generatePlaintext(emailGenerate),
        html    : mailGenerator.generate(emailGenerate),
    };

    smtpTransport.sendMail(mail, (error, response) => {
        smtpTransport.close();
    });
};
