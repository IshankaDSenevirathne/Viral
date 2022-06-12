const mongoose = require("mongoose");

const liveStatsSchema= new mongoose.Schema({
    totalStoreBalance:{
        type:Number,
        default:0
    },
    totalUsers:{
        type:Number,
        default:0
    },
    totalBalanceToday:{
        type:Number,
        default:0
    },
    newUsersToday:{
        type:Number,
        default:0
    },
    newOrdersToday:{
        type:Number,
        default:0
    },
    ordersCompletedToday:{
        type:Number,
        default:0
    },
    totalOrdersToday:{
        type:Number,
        default:0
    },
},{timestamps:true})

export default mongoose.models?.LiveStats || mongoose.model("LiveStats",liveStatsSchema);