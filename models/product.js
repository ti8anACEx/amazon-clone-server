const mongoose = require('mongoose');
const ratingSchema = require('../models/rating');

const productSchema = mongoose.Schema({
    name : {
        required : true,
        type:String,
        trim:true,
    },
    description : {
        required : true,
        type:String,
        trim:true,
    },
    images : [
        {
            type : String,
            required: true,
        }
    ],
    quantity : {
        type: Number,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    category : {
        type: String,
        required: true,
    },
    //ratings
    ratings:[ratingSchema],
});


const Product = mongoose.model('Product', productSchema);
module.exports = {Product,productSchema};