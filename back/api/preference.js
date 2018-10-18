var express = require('express')
var router = express.Router()
var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var config = require('../../config/database')


router.get('/', function (req, res) {

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

        User.getPreference(decoded.id, function (err, preference) {
            if (err) throw err
            res.status(200).send(preference)
            console.log(preference)
        })


    })
})

module.exports = router