var express = require('express')
var router = express.Router()
var User = require('../../models/user')

router.get('/', function (req, res) {
    userId = req.query.userId

    User.getPreference(userId, function (err, preference) {
        if (!preference) {
            res.send("Preference not found")
        }
        res.send(preference)
    })
})








module.exports = router