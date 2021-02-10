const axios = require('axios')
const { publishToQueue } = require("../queueUtils");
const InfluenceModel = require("../models/Influence");
const schemas = require("./schemas");
const task_queue = "influence_task_queue"
const paystack_private_key = process.env.PAYSTACK_PRIVATE_KEY
const paystack_public_key = process.env.PAYSTACK_PUBLIC_KEY
let crypto = require('crypto')


exports.createInfluence = async (ctx, payload) => {

    return new Promise(async (resolve, reject) => {
        const { error, value } = schemas.influence.create.validate(payload);

        if (error !== undefined)
            return reject({ status: 'error', message: error.message, code: 422 });

        //calculate cost
        if (value.tweet_id)
            value.cost = value.goal * 150;
        else {
            value.cost = value.goal * 120;
        }
        value.user = ctx.user.id;

        let influence = await InfluenceModel.create(value);
        return resolve({ status: "success", influence });
    })
}

exports.generatePaymentLink = async (ctx, id) => {
    return new Promise(async (resolve, reject) => {

        let influence = await InfluenceModel.findOne({ _id: id, user: ctx.user.id });
        if (!influence)
            return reject({ status: 'error', message: "Not Found", code: 404 });

        let ps_payload = {
            email: ctx.user.email,
            amount: influence.cost * 100,
            reference: `${influence.id}==${Date.now()}`,
            currency: "NGN",
        };
        let res = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            ps_payload,
            {
                headers: {
                    authorization: `Bearer ${paystack_private_key}`,
                    "Content-Type":
                        "application/json",
                },
            }
        );
        if (res.data.status) {
            let data = res.data.data;
            return resolve({
                status: "success",
                authorization_url: data.authorization_url
            });
        } else {
            return reject({
                status: "error", message: "Payment Error", code: 500
            });
        }
    })
}

exports.hook = async (req) => {
    return new Promise(async (resolve, reject) => {

        if (req.headers["x-paystack-signature"]) {
            var hash = crypto
                .createHmac(
                    "sha512",
                    paystack_public_key
                )
                .update(JSON.stringify(req.body))
                .digest("hex");

            let { data, event } = req.body;
            if (hash !== req.headers["x-paystack-signature"] || event !== "charge.success")
                resolve({ status: 'error', message: "Nice Try", code: 401 })

            let reference = data.reference;
            let id = reference.split("==")[0];
            // let amount = data.amount / 100; //naira-centric
            let influence = await InfluenceModel.findByIdAndUpdate(id, { new: true }, {
                $set: {
                    payment_ref: reference
                }
            });

            try {
                await publishToQueue(task_queue, JSON.stringify(influence));
            }
            catch (err) {
                return reject({ status: 'error', message: err.message, code: 500 })
            }

            return resolve({ status: 200 });
        }


        return reject({ status: 200 });

    })
}

exports.getInfluence = async (ctx, _id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let influence = await InfluenceModel.findOne({ user: ctx.user.id, _id });
            if (influence)
                return reject({ status: "error", message: "Not Found", code: 404 });

            return resolve({ status: "success", influence })
        }
        catch (err) {
            return reject({ status: "error", message: "Internal Server Error", code: 500 })
        }


    })
}

exports.getAllInfluence = async (ctx) => {
    return new Promise(async (resolve, reject) => {
        try {
            let influences = await InfluenceModel.find({ user: ctx.user.id }).sort([['createdAt', -1]]);
            return resolve({ status: "success", influences })

        }
        catch (err) {
            return reject({ status: "error", message: "Internal Server Error", code: 500 })
        }

    })
}