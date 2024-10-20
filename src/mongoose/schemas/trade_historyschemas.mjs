

import mongoose, { mongo } from "mongoose";

const perp_history = new  mongoose.Schema({
    symbol : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
        
    },
    orderId : {
        type:mongoose.Schema.Types.Number,
            require :true,
            unique: true
        
    },
    side : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
    },

    type : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
        
    },
    price : {
        type:mongoose.Schema.Types.Number,
            require :true,
            unique: false
    },
    time : {
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false
        
    },
    leverage : {
        type:mongoose.Schema.Types.Number,
            require :true,
            unique: false
        
    },
    

    
})

const Trade_history  =  mongoose.model('Trade_history',perp_history)

export default Trade_history;
