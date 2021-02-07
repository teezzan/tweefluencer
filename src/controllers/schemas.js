const Joi = require('joi');
let EMAIL_REGEX = new RegExp(`/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/`)

module.exports = {
    user: {
        accountCreation: Joi.object().keys({
            firstname: Joi.string().min(1).required(),
            lastname: Joi.string().min(1).required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[\x20-\x7E]+$/).min(8).max(72).required(),
            phone: Joi.string().min(9).max(12).required()

        }),
        authentication: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[\x20-\x7E]+$/).min(8).max(72).required()
        }),
        passwordRetrieval: Joi.object().keys({
            email: Joi.string().email().required()
        })

    }
}