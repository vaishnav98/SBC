var express = require('express')
var router = express.Router()
var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var config = require('../../config/database')


router.post('/', function (req, res) {
    var temp = req.body.temp
    var moist = req.body.moist

    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    })

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.'
        })
        if (temp === undefined || moist === undefined) {
            res.status(500).send("Field empty")
        } else {

            User.updatePresentState(decoded.id, {
                    temp: temp,
                    moist: moist
                },

                function (flag) {
                    console.log("FLAG ", flag)
                    if (flag) {
                        res.status(200).send('Updated')
                    } else {
                        res.status(500).send("Couldnt update")
                    }

                })
        }

    })
})

module.exports = router