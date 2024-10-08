
import mongoose, { mongo } from "mongoose";

const userschema = new  mongoose.Schema({
    username:{
        type:mongoose.Schema.Types.String,
            require :true,
            unique: true
        
    },
    password: {
        type: mongoose.Schema.Types.String,
        require:true,
    
    }
})

const User=  mongoose.model('User',userschema)

export default User;





