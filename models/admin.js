var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var AdminSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },  
    email : {
        type : String,
        required : true,
        index : true,
        unique : true
    },
    password : {
        type : String
    }
});

var Admin = (module.exports = mongoose.model("Admin", AdminSchema));

module.exports.createAdmin = function (newAdmin, callback) {
    console.log("create Admin entered");
    // console.log("newAdmin :", newAdmin)
    if (newAdmin.name && newAdmin.password) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newAdmin.password, salt, function (err, hash) { 
                if(err) callback(err)
                newAdmin.password = hash;
                newAdmin.save(callback);
            });
        });
    } else {
        console.log("else");
    }
};

module.exports.getAdminByEmail = function (email, callback) {
    console.log("Get Admin by email id enterd");
    query = {
        email : email
    }
    Admin.findOne(query, callback);
};

module.exports.getAdminByAdminName = function (name, callback) {
    var query = {
        name: name
    };
    Admin.findOne(query, callback);
};


module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) {
            console.log("password didnt match");
            console.log("isMatch : ", isMatch);
        }
        console.log("isMacth :", isMatch);
        callback(null, isMatch);
    });
};


