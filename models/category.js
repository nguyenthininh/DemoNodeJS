var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }]
});
var ObjectModel = mongoose.model('categories', Schema);
module.exports = ObjectModel;