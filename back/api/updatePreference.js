var express = require('express')
var router = express.Router()
var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var config = require('../../config/database')


router.post('/', function (req, res) {

    var token = req.headers['x-access-token'];

    var update = {
        temp: req.body.temp,
        moist: req.body.moist
    }

    if (!token) {
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        })
    } else if (update.temp == undefined || update.moist == undefined) {
        return res.status(400).send('Parameters not set')
    } else {

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            })

            User.updatePreference(decoded.id, update, function (flag) {
                if (flag) {
                    res.status(200).send('Preference Updated')
                } else {
                    res.status(400).send('Error in retriving error')
                }
            })


        })
    }
})

module.exports = router