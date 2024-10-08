

import mongoose, { mongo } from "mongoose";

const balanceSchema = new  mongoose.Schema({

    userid:{
        type: mongoose.Schema.Types.String,
        require:true,
        unique: true,
    },
    balance:{
        type:mongoose.Schema.Types.String,
            require :true,
            unique: true
        
    },
    equity: {
        type: mongoose.Schema.Types.String,
        require:true,
    
    },
    asset:{
        type:mongoose.Schema.Types.String,
            require :true,
            unique: false,
        
    },
    
})

const Balance=  mongoose.model('Balance',balanceSchema)

export default Balance;






