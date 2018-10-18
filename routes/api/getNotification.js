var express = require('express')
var router = express.Router()
var Notification = require('../../models/notification')
var Admin = require('../../models/admin')


router.get('/', function (req, res) {
    console.log(req.query.date, Date.now())
    date = req.query.date
    Notification.find /*getNotificationByDate*/({}).populate('admin').select('-admin.name').exec(function (err, notification) {
        if (err) res.status(500).send({
            message: 'Error'
        })
        // var json = { contacts : notification}



        res.status(200).send(notification)

    })
})


module.exports = router