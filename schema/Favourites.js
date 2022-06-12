const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    emailAddress:{
        type:String,
        required:true,
        trim:true
    },
    productId:{
        type:String,
        trim:true,
        required:true
    },
    productName:{
        type:String,
        required:[true,'Please add a Shoe title'],
        unique:true,
        trim:true,
        maxlength:[40,'Title cannot be more than 40 characters']
    },
    productCompany:{
        type:String,
        required:[true,'Please add a Shoe title'],
        trim:true,
        maxlength:[20,'Title cannot be more than 20 characters']
    },
    productFeatures:{
        type:String,
        default:undefined,
        trim:true,
        required:[true,'Please add a description'],
        maxlength:[40,"Features cannot exceed 40 characters"]
        // validate:[featureLimit,'Cannot exeed maximum allowed features(6)']
    },
    productPrice:{
        type:Number,
        required:true,
    },
    productColors:[{
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
    productSizes:
        [{
            size:{
                type:String,
                required:true,
                trim:true
            },
            availability:{
                type:Boolean,
                defaault:false
            }
        }],
    productImages:[String]
    }
)

module.exports = mongoose.models.Favourites || mongoose.model('Favourites',favouriteSchema);