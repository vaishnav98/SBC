var express = require('express')
var router = express.Router();
var User = require('../models/user.js')

router.get('/', function (req, res) {
    var user = req.query.user
    var pass = 'pass'

    console.log('Inside router', user)
    if (user) {

        var newUser = new User({
            username: user,
            password: pass

        })
        User.createUser(newUser, function (err, user) {
            User.getPreference(user._id, function (err, preference) {
                console.log('!@!@!@!', preference)
            })
            User.getClientHistory(user._id, function (err, history) {
                console.log('##########', history)
            })
            /* console.log(user) */
        })
        res.send("IN ROUTER ARD")
        // console.log(User.createUser)


    }
})

module.exports = router