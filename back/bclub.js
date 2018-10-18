var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Preference = require("./preference");
var ClientHistory = require("./history");
var News = require("./news");
var PresentState = require("../models/presentState");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var ClubSchema = mongoose.Schema({
    /* _id: {
            type: mongoose.Schema.Types.ObjectId
        }, */
    name : {
        type : String,
        index : true,
        required : true,
        unique : true
    },
    /* admins : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }], */
    /* news : [{
        type : Schema.Types.ObjectId,
        ref : "News"
    }] */
    news : {
        heading : {
            type : String,
            required : true
        },
        content : {
            type : String,
        }

    }

    
});

ClubSchema.plugin(uniqueValidator);

var Club = (module.exports = mongoose.model("Club", ClubSchema))


module.exports.createClub = function (newClub, callback) {
    console.log("Create Club entered");
    // console.log("newClub :", newClub)
    if (newClub.name) {
        newClub.save(callback);
        
    } else {
        console.log("Club creation failed : Clubname is not valid");
    }
};


module.exports.getClubByName = function (name, callback) {
    var query = {
        name: name
    };
    Club.findOne(query, callback);
};

module.exports.pushNotification = function(club_name, notification){
    Club.findOne(club_name,function(err,club){
        if(err)throw err
        news = new News()
        news.heading = notification.heading
        news.newsContent = notification.newsContent
        if(club.news.length === 0){
            news.id = 0
        } else {
            news.id = club.news[club.news.length - 1] + 1    
        }
        news.save()
        club.news.push(notification._id)
    })
}

module.exports.changeNotification = function(club_name, notification,callback){
    Club.findOne(club_name,function(err,club){
        if(err) throw err

        if( notification.id < club.new.length && notification.id >= 0)
        {
            if(club.news[notification.id]){
                News.findById(club.news[notification.id],function(err,theActualNewsObject){
                    if(err) throw err

                    theActualNewsObject.heading = notification.heading
                    theActualNewsObject.newsContent = notification.newsContent
                    theActualNewsObject.save()

                    callback(true)
                })
            }
            else{
                callback(false)
            }
        }
        else{
            callback(false)
        }
        
    })
}


