var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, '제목을 입력해주세요']
    },
    thumbnail: String, //이미지 파일명
    price: Number,
    description: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
    username: String
});

ProductSchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
    }
})

ProductSchema.plugin(autoIncrement.plugin, {model: 'product', field: 'id', startAt:1});

module.exports = mongoose.model('product', ProductSchema);