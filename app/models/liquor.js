// app/models/liquor.js

var mongoose       = require('mongoose');
var Schema         = mongoose.Schema;

var LiquorSchema   = new Schema({
    name: String,
    type: String,
    description: String,
    comments: String,
    ranking: Number,
    imgUrl: String
});

module.exports = mongoose.model('Liquor', LiquorSchema);
