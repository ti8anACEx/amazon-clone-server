const mongoose = require('mongoose');
const { productSchema } = require('./product');

const orderSchema = mongoose.Schema({
    products : [
        {
            product : productSchema,
            quantity : {
                type : Number,
                required : true,
            }
        },
    ],
    totalPrice : {
        type : Number,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    userId : {
        type : String,
        required : true,
    },
    orderedAt : {
        type : Number, // will store milliseconds since epoch, ie., January 1, 1970
        required : true,
    },
    status : {
        type : Number, // 0 - pending, 1 - completed, 2 - received, 3 - delivered
        default : 0,
    },
})

const Order = mongoose.model('Order',orderSchema);
module.exports = Order;