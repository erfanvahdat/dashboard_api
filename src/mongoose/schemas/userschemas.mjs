
import mongoose, { mongo } from "mongoose";

const userschema = new  mongoose.schema({
    username:
    {
    type:mongoose.Schema.Types.String,
        require :true,
        unique: true
        
    },
    display_name :mongoose.Schema.Types.String,

    password: {
        type: mongoose.Schema.Types.String,
        require:true,
    
    }
})





