var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoincrement = require('mongoose-auto-increment');

var Comment = new Schema({
    content: String,
    created_at:{
        type: Date,
        default: Date.now()
    },
    product_id: Number
});

Comment.plugin(autoincrement.plugin, {model: "comment", field: "id", startAt:1});

module.exports = mongoose.model("comment", Comment);

