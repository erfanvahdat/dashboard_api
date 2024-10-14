


import mongoose, { mongo } from "mongoose";

const crypto_list_schemas = new  mongoose.Schema({
    symbol : {
        type:mongoose.Schema.Types.String,
            require :false,
            unique: true
        
    },
    
})

const Crypto_list_model  =  mongoose.model('crypto_list',crypto_list_schemas)

export default Crypto_list_model;
