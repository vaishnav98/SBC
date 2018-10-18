var express = require('express')
var router = express.Router()
var User = require('../../models/user')
var PresentState = require('../../models/presentState')

router.get('/', function (req, res) {
    userId = req.query.userId
    console.log('userId :', userId)

    User.getPresentState(userId, function (err, presentState) {
        console.log("Present Route object :", presentState)
        if (!presentState) {
            res.send("Preference not found")
        }
        if ((presentState.moist == presentState.moistBackUp) && (presentState.temp == presentState.tempBackUp)) {
            res.send(null)
        } else {


            presentState.moistBackUp = presentState.moist
            presentState.tempBackUp = presentState.temp
            presentState.save(function (err) {
                console.log(err)
            })
            res.send(presentState)

        }
    })
})








module.exports = router