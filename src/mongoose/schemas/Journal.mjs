import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    type: { type: String, required: true },
    result: { type: String, required: true },
    time: { type: Date, required: true },
    description: { type: String, required: true },
    market: { type: String, required: true },
    image: { type: String, required: true },

});

const journal_model = mongoose.model("Journal", journalSchema);
export default journal_model;
