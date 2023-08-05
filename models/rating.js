const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    userId:{
        type : String,
        required : true,
    },
    rating:{
        type : Number,
        required : true,
    },
});

module.exports = ratingSchema;

// not making any model of this