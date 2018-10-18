var express = require('express')
var router = express.Router()
var Admin = require('../../models/admin')
var jwt = require('jsonwebtoken')
var config = require('../../config/database')

router.get('/', function (req, res) {
    if (req.query.email && req.query.password) {
        console.log("login - email : ",req.query.email," password : ",req.query.password)
        Admin.getAdminByEmail(req.query.email,
            function (err, admin) {
                if (err) return res.status(500).send("No email Id or its specified password found")
                Admin.comparePassword(req.query.password, admin.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        var token = jwt.sign({
                            id: admin._id
                        }, config.secret, {
                            expiresIn: 8640
                        })

                        res.status(200).send({
                            auth: true,
                            token: token
                        })
                    } else {
                        res.status(500).send("Password or email not authorized")
                    }
                })



            }

        )
    } else {
        // console.log(req)
        res.status(500).send("No password or email given")

    }
})


module.exports = router