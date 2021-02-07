var express = require("express");
var UserController = require("../controllers/UserController.js");
const router = express.Router();
let bodyParser = require("body-parser");


router.use(bodyParser.urlencoded({ extended: false }));
router.get("/greet", (req, res) => {
    UserController.greet().then((response) => {
        res.status(200).json(response);
    });
});

router.post("/register", (req, res) => {
    UserController.create(req.body).then((response) => {
        res.status(201).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});

router.post("/login", (req, res) => {
    UserController.login(req.body).then((response) => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});

router.post("/forgetpassword", (req, res) => {
    UserController.forgetPassword(req.body).then((response) => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});



router.get("/verify", (req, res) => {
    console.log(req.query)
    UserController.verifyPasswordToken(req.query).then((response) => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});


module.exports = router;
