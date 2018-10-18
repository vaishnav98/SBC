var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Preference = require("./preference");
var ClientHistory = require("./history");
var GrowBox = require("./news");
var PresentState = require("./presentState");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
    /* _id: {
            type: mongoose.Schema.Types.ObjectId
        }, */
    username: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        // index: true
    },
    password: {
        type: String,
        required: true
    },
    preference: {
        type: Schema.Types.ObjectId,
        ref: "Preference"
    },
    history: [{
        //Array confusion
        type: Schema.Types.ObjectId,
        ref: "ClientHistory"
    }],
    growBox: {
        type: Schema.Types.ObjectId,
        ref: "GrowBox"
    },
    presentState: {
        type: Schema.Types.ObjectId,
        ref: "PresentState"
    }
});

UserSchema.plugin(uniqueValidator);

var User = (module.exports = mongoose.model("User", UserSchema));
module.exports.createUser = function (newUser, callback) {
    console.log("create user entered");
    // console.log("newUser :", newUser)
    if (newUser.username && newUser.password) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                preference = new Preference();
                preference.temp = 25;
                preference.moist = 90;
                preference.save();

                history = new ClientHistory();
                // history.temp.push(25);
                // history.moist.push(90);
                history.save();

                growBox = new GrowBox();
                growBox.save();
                // growBox.id.push(ipAddr)

                presentState = new PresentState();
                presentState.temp = 25;
                presentState.moist = 90;
                presentState.tempBackUp = 25;
                presentState.moistBackUp = 90;
                presentState.save();

                newUser.preference = preference._id;
                newUseregrowBox = growBox._id;
                newUser.history = history._id;
                newUser.presentState = presentState._id;
                newUser.password = hash;

                newUser.save(callback);
            });
        });
    } else {
        console.log("else");
    }
};

module.exports.getUserByEmail = function (email, callback) {
    console.log("Get user by email id enterd");

    var query = {
        email: email
    };
    User.findOne(query, callback);
};

module.exports.getUserByUsername = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
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

module.exports.updateState = function (userId, temperature, moist) {
    User.findById(userId, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("User Id not found");
            return;
        }
        ClientHistory.update(user.history, temperature, moist);
    });
};

module.exports.updatePreference = function (userId, update, callback) {
    User.findById(userId, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("User Id not found");
            return;
        }
        Preference.update(user.preference, update, callback);
    });
};

module.exports.updateGrowBox = function (userId, id) {
    User.findById(userId, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("User Id not found");
            return;
        }
        GrowBox.update(user.growBox, id);
    });
};

module.exports.getPreference = function (userId, callback) {
    User.findById(userId, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("User Id not found");
            // return;
        }

        Preference.contains(user.preference, callback);
    });
};

module.exports.getClientHistory = function (userId, callback) {
    User.findById(userId, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("User Id not found");
            return;
        }
        ClientHistory.contains(user.history, callback);
    });
};

module.exports.getGrowBox = function (userId, callback) {
    User.findById(userId, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("User Id not found");
            return;
        }
        GrowBox.contains(user.growBox, callback);
    });
};

module.exports.getPresentState = function (userId, callback) {
    User.findById(userId, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("User I not found");
        }
        PresentState.contains(user.presentState, callback);
    });
};

module.exports.updatePresentState = function (userId, update, callback) {
    User.findById(userId, function (err, user) {
        if (err) {
            console.log("updatePresentState : internal error");
        }
        if (!user) {
            console.log("User not found");
        }
        PresentState.update(user.presentState, update, callback);
    });
};