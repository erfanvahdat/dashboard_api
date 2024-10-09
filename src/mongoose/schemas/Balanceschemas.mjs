

import mongoose, { mongo } from "mongoose";

const balanceSchema = new  mongoose.Schema({

    userid:{
        type: mongoose.Schema.Types.String,
        require:true,
        unique: false,
    },
    balance:{
        type:mongoose.Schema.Types.String,
        require :true,
        unique: false,
        
    },
    equity: {
        type: mongoose.Schema.Types.String,
        require:true,
        unique: false,
    
    },
    asset:{
        type:mongoose.Schema.Types.String,
        require :true,
        unique: false,
        
    },
    
})

const Balance=  mongoose.model('Balance',balanceSchema)

export default Balance;

