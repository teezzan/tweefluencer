let axios = require('axios');
let User = require("../models/User");
const Joi = require('joi');
let schemas = require('./schemas')

exports.greet = async () => {
    return new Promise((resolve, reject) => {
        resolve({ say: 'helloworld' });
    })
}

exports.create = async (payload) => {

    return new Promise(async (resolve, reject) => {
        const { error } = schemas.user.accountCreation.validate(payload);

        if (error !== undefined)
            return reject({ status: 'error', message: error.details.message, code: 422 });
        let { email, password, firstname, lastname, phone } = payload;
        let found = await User.findOne({ $or: [{ email }, { phone }] });
        // let found = await User.findOne({ email });
        if (found)
            return reject({ status: 'error', message: "User Exists", code: 422 });

        User.create({ email, password, name: firstname + lastname, phone }).then(user => {
            return resolve(user)
        }).catch(err => {
            return reject({ status: 'error', message: err.message, code: 500 })
        })
    })
}
