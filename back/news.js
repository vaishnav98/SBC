var mongoose = require('mongoose')
var pluginUpdate = require('../config/database').pluginUpdate

var newsSchema = mongoose.Schema({
    id: {
        type : Number,
        unique : true   
    },
    heading : { 
        type: String
    },
    newsContent: {
        type: String
    }
})
newsSchema.plugin(pluginUpdate)

var News = module.exports = mongoose.model('News', newsSchema)

module.exports.update = function (newsId, newsEntered) {

    News.findById(newsId, function (err, newsRequired) {
        if (err) throw err

        newsRequired.heading = newsEntered.heading
        newsEntered.newsContent = newsEntered.newsContent 

    })
}


