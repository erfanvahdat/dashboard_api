

import mongoose, { mongo } from "mongoose";

const Trade = new  mongoose.Schema({
    symbol : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: true
        
    },

    stop_loss : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
        
    },
    take_profit : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
    },

    limitprice : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
        
    },
    quantity : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
    },
    side : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
        
    }
    
})

const Trade_status  =  mongoose.model('Trade',Trade)

export default Trade_status;
