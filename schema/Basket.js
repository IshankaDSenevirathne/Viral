const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
    emailAddress:{
        type:String,
        required:[true,'Please enter your Email'],
        trim:true
    },
    orderDetails:{
        products:[
            {
                productName:{
                    type:String,
                    trim:true,
                    required:true
                },
                productSize:{
                    type:String,
                    trim:true,
                    required:true
                },
                productColor:{
                    type:String,
                    trim:true,
                    default:"black"
                },
                productQuantity:{
                    type:Number,
                    required:true
                },
                productPrice:{
                    type:Number,
                    required:true
                },
                productImage:{
                    type:String,
                    required:true,
                    trim:true,
                },
                productCompany:{
                    type:String,
                    trim:true,
                    required:true
                },
            }
        ],
        totalPrice:{
            type:Number,
            required:true
        }
    },
    paymentStatus:{
        type:String,
        trim:true,
        default:"Pending"
    },
    orderStatus:{
        type:String,
        trim:true,
        default:"Saved"
    }
    },
    {timestamps:true}
)

module.exports = mongoose.models.Basket || mongoose.model('Basket',basketSchema);