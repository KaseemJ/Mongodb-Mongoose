var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        require: true
    },

});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;