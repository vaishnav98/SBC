var express = require('express')
var router = express.Router()
var Admin = require('../../models/admin')
var jwt = require('jsonwebtoken')
var config = require('../../config/database')


router.post('/', function (req, res) {

    console.log('req.name : ', req.body.name, 'req.password : ', req.body.password, 'req.email', req.body.email)

    console.log('req.body', req.body)

    if (req.body.name && req.body.email && req.body.password) {

        var newAdmin = new Admin({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        })

        Admin.createAdmin(newAdmin, function (err, admin) {
            if (err) return res.status(500).send("There was a problem registering the admin.")

            // create a token
            var token = jwt.sign({
                id: admin._id
            }, config.secret, {
                expiresIn: 8640
            })

            console.log('admin registered :', admin)

            res.status(200).send({
                auth: true,
                token: token
            })
        })
    } else {
        res.status(500).send("Credentials incomplete")
    }
})

module.exports = router