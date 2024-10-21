
import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
    balance: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    equity: {
        type: mongoose.Schema.Types.String,
        required: true, 
        unique: true,
    },
    asset: {
        type: mongoose.Schema.Types.String,
        required: true, 
        unique: false,
    },
}, { timestamps: true }); 

const Balance_model = mongoose.model('Balance', balanceSchema);

export default Balance_model;
