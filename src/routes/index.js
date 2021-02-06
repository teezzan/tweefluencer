var express = require("express");
var UserController = require("../controllers/UserController.js");
const router = express.Router();

router.get("/greet", (req, res) => {
    UserController.greet().then((response) => {
        res.status(200).json(response);
    });
});

router.post("/register", (req, res) => {
    UserController.create(req.body).then((response) => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});


module.exports = router;
