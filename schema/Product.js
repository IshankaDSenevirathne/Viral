const mongoose = require('mongoose');

//validate features
// function featureLimit(val){
//     return val.length<=6;
// }
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a Shoe title'],
        unique:true,
        trim:true,
        maxlength:[40,'Title cannot be more than 40 characters']
    },
    company:{
        type:String,
        required:[true,'Please add a Shoe title'],
        trim:true,
        maxlength:[20,'Title cannot be more than 20 characters']
    },
    category:{
        type:String,
        trim:true,
    },
    genders:{
        type:[String],
        default:undefined,
        required:true,
        trim:true
    },
    ages:{
        type:[String],
        default:undefined,
        required:true,
        trim:true
    },
    features:{
        type:String,
        default:undefined,
        trim:true,
        required:[true,'Please add a description'],
        maxlength:[40,"Features cannot exceed 40 characters"]
        // validate:[featureLimit,'Cannot exeed maximum allowed features(6)']
    },
    price:{
        type:Number,
        required:true,
    },
    colors:[{
        name:{
            type:String,
            required:true,
            trim:true
        },
        class:{
            type:String,
            required:true,
            trim:true
        },
    }],
    sizes:
        [{
            size:{
                type:String,
                required:true,
                trim:true
            },
            availability:{
                type:Boolean,
                default:false
            }
        }],
    availability:{
        type:Boolean,
        default:true
    },
    ratingDetails:{
        rating:{
            type:Number,
            default:0
        },
        reviewCount:{
            type:Number,
            default:0
        },
        userReviews:[{
            user:{
                type:String,
                trim:true,
            },
            review:{
                type:String,
                trim:true
            }
        }]
    },
    images:[{

            url:{
                type:String,
                trim:true,
                required:true,
            },
            publicID:{
                type:String,
                trim:true,
                required:true,
            },

        }
    ]
})

export default mongoose.models?.Products || mongoose.model("Products", productSchema);