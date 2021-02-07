let axios = require('axios');
let User = require("../models/User");
const Joi = require('joi');
let schemas = require('./schemas');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let _ = require('lodash')

let JWT_SECRET = process.env.JWT_SECRET || "jwt-test-secret";
let public_fields = ["id", "name", "email", "phone"]

let generateJWT = (user) => {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 7);

    return jwt.sign({
        id: user.id,
        username: user.email,
        exp: Math.floor(exp.getTime() / 1000)
    }, JWT_SECRET);
};
let publify = async (user, fields) => {
    return await _.pick(user, [...fields]);
}

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
        if (found)
            return reject({ status: 'error', message: "User Exists", code: 422 });

        User.create({ email, password: bcrypt.hashSync(password, 10), name: firstname + lastname, phone }).then(async (user) => {
            return resolve({ user: await publify(user, public_fields), token: generateJWT(user) })

        }).catch(err => {
            return reject({ status: 'error', message: err.message, code: 500 })
        })
    })
}

exports.login = async (payload) => {

    return new Promise(async (resolve, reject) => {
        const { error } = schemas.user.authentication.validate(payload);

        if (error !== undefined)
            return reject({ status: 'error', message: error.details.message, code: 422 });
        let { email, password } = payload;
        let found = await User.findOne({ email });
        if (!found)
            return reject({ status: 'error', message: "User Does not Exist", code: 401 });
        const pass_auth = await bcrypt.compare(password, found.password);
        if (!pass_auth)
            return reject({ status: 'error', message: "Wrong Password", code: 401 });
        return resolve({ user: await publify(found, public_fields), token: generateJWT(found) })

    }

    )
}
