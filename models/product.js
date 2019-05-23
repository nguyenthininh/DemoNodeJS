var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    detail: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'categories'
    },
    createdAt: {type: Date},
    updatedAt: {type: Date},
    status: Number
});

ProductSchema.pre('save', function (next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

ProductSchema.index({name: 'text', description: 'text', detail: 'text'});

var Product = mongoose.model('products', ProductSchema);
module.exports = Product;