const mongoose = require("mongoose");

const statHistorySchema=mongoose.Schema({
    Year:{
        type:Number,
        required:true,
    },
    january:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    february:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    March:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    April:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    May:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    June:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    July:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    August:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    September:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    Octomber:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    November:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
    December:{
        totalEarnings:{
            Type:Number
        },
        totalUsers:{
            Type:Number
        },
        totalOrders:{

        },
        accountBalance:{

        }
    },
},{timestamps:true})