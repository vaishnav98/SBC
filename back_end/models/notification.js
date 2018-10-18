var mongoose = require("mongoose");
// var News = require("./news");
// var uniqueValidator = require("mongoose-unique-validator");
var pluginUpdate = require('../config/database').pluginUpdate
var Schema = mongoose.Schema;

var NotificationSchema = mongoose.Schema({
    clubName : {
        type : String,
    },  
    heading : {
        type : String,
        required : true
    },
    content : {
        type : String,
    },
    admin : {
        type : Schema.Types.ObjectId,
        ref : "Admin"
    },
    adminEmail : {
        type : String
    },
    createdAt: {
        type : Date
    },
    updatedAt: {
        type : Date,
        index : true,
        
    }
});

NotificationSchema.plugin(pluginUpdate);

var Notification = (module.exports = mongoose.model("Notification", NotificationSchema))


module.exports.getNotificationByDate = function (date, callback) {
    var query = {
        updatedAt : date
    };
    Notification.find(query, callback);
};

module.exports.pushNotification = function(admin, notification,callback){
    back_notification = new Notification()
    back_notification.clubName = notification.clubName
    back_notification.heading = notification.heading
    back_notification.content = notification.content
    back_notification.admin = admin
    back_notification.save(callback)
}

module.exports.changeNotification = function(notification_id, notification,admin,callback){
    Notification.findById(notification_id,function(err,back_notification){
        if(err) callback(err)

        back_notification.heading = notification.heading
        back_notification.content = notification.content
        back_notification.admin = admin
        back_notification.save(callback)
        
    })
}

module.exports.removeNotification = function(notification_id,callback){
    Notification.findByIdAndRemove(notification_id,function(err){
        if(err) callback(err)

        callback(true)

    })
}


