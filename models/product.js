const mongoose = require('mongoose')
const product_schema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    images: [
        {
            type: String,
            default: '',
        },
    ],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
        min: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numberReviews: {
        type: Number,
        default: 0,
    },
    isBestseller: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

product_schema.virtual('id').get(function () {
    return this._id.toHexString()
})

product_schema.set('toJSON', {
    virtual: true,
})

exports.Product = mongoose.model('Product', product_schema)
exports.product_schema = product_schema
