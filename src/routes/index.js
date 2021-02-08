var express = require("express");
var UserController = require("../controllers/UserController.js");
const router = express.Router();
let bodyParser = require("body-parser");

let authenticate = async function (req, res, next) {
    let { authorization } = req.headers;
    if (authorization) {
        let token = authorization.split(' ')[1]
        let user = await UserController.resolveToken({ token })
        if (user) {
            req.ctx = { user, auth: true }
        }
        else {
            req.ctx = { auth: false }
        }
    }
    else {
        req.ctx = { auth: false }
    }

    next()
}

let authorize = async function (req, res, next) {

    if (req.ctx.auth == false) {
        res.status(401).json({ message: "UnAuthorized" })
        return
    }
    console.log("Authorized as ", req.ctx.user.email);
    next()
}


router.use(authenticate)

router.use(bodyParser.urlencoded({ extended: false }));
router.get("/greet", authorize, (req, res) => {
    UserController.greet(req.ctx).then((response) => {
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
    UserController.verifyPasswordToken(req.query).then((response) => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});

router.post("/change_pass", (req, res) => {
    UserController.changePassword(req.body).then((response) => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});

router.post("/updateme", authorize, (req, res) => {

    UserController.editUser(req.ctx, req.body).then((response) => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(err.code).json(err);
    })
});


module.exports = router;
