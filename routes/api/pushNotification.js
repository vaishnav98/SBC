var express = require('express')
var router = express.Router()
var Admin = require('../../models/admin')
var Notification = require('../../models/notification')
var jwt = require('jsonwebtoken')
var config = require('../../config/database')


router.post('/', function (req, res) {

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

        var noti = {
            clubName : req.body.clubName,
	        heading : req.body.heading,
	        content : req.body.content
        }

        Notification.pushNotification(decoded.id,noti,function(err){
            if(err) res.status(500).send({
                message : 'Internal error'
            })

            res.status(200).send({
                message : 'OK'
            })
        })
        


    })
})

module.exports = router