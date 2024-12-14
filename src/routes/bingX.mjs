import express, { response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import chalk from "chalk";
const router = express.Router();

// BingX importing modules
import trade_order from "../bingxapi/trade_order.mjs";
import all_positon_orders from "../bingxapi/all_open_positions.mjs";
import all_pending_orders from "../bingxapi/all_pending_orders.mjs";
import close_pending_orders from "../bingxapi/close_pending_orders.mjs";
import close_position_orders from "../bingxapi/close_open_positions.mjs";
import Trade_history from "../bingxapi/trade_history.mjs";

import crpyto_list from "../bingxapi/crypto_list_api.mjs";
import Trade_status from "../mongoose/schemas/Trade_status.mjs";
import set_tp_sl from "../bingxapi/set_tp_sl.mjs";

import Reverse_order from "../bingxapi/reverse_trade.mjs";
// improt relevent schemas
import trade_history_model from "../mongoose/schemas/trade_historyschemas.mjs";
import Crypto_list_model from "../mongoose/schemas/cryptolistschemas.mjs";
import reverse_order from "../bingxapi/reverse_trade.mjs";

dotenv.config({ path: "../.env" }); // Load environment variables

// Get Crypto list from db
router.get("/crypto_list", async (req, res) => {
    try {
        const obj = await crpyto_list();

        return res.status(200).send(obj);
    } catch (err) {
        console.log("Crypto_list does not work... ", err);
        return res.status(500).send({ msg: "Server error" });
    }
});

// Post the data into DB
router.post("/crypto_list", async (req, res) => {
    const { body } = req;

    try {
        const db_crypto_list = await Crypto_list_model.find();

        if (typeof db_crypto_list !== "undefined" && db_crypto_list.length === 0) {
            console.log("No existing data found, fetching from BingX...");

            // Fetch data from the external API
            const crypto_list_bingx = await axios.get(
                "http://localhost:3005/api/crypto_list"
            );
            const newCryptoData = await crypto_list_bingx.data;

            console.log("data is here....", newCryptoData);

            newCryptoData.forEach((element) => {
                const newCryptoEntry = new Crypto_list_model({
                    symbol: element,
                });
                newCryptoEntry.save();
            });

            // After saving, fetch the updated data from the DB
            const db_query_crypto_list = await Crypto_list_model.find();
            return res
                .status(201)
                .send({ msg: "Data is- updated", data: db_query_crypto_list });
        } else {
            // If data exists, return the existing data from the database
            return res
                .status(200)
                .send({ msg: "Data already exists", data: db_crypto_list });
        }
    } catch (err) {
        console.error("Error processing crypto list:", err);
        return res.status(400).json({ msg: "Server error" });
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------OPENING TRADES---------------------------------------------------------------------------------

// Trade Order
router.post("/trade_order", async (req, res) => {
    const { body } = req;
    try {
        const data = await trade_order(body);

        if (data == null) {
            console.log("Data is null");
            return res.status(400).send({ msg: "No data found" });
        }

        // Return data directly in the response
        return res.status(201).json({
            msg: "Trade is Created...",
            data: data.data,
        });
    } catch (err) {
        console.error("Trade order does not work properly:", err);
        return res.status(500).send({ msg: "Server error" });
    }
});

// Trade Order
router.post("/set_sl_tp", async (req, res) => {
    const { body } = req;
    try {
        // stauts of setting stop or profit
        const status = body.status;
        let set_value = null;
        const use_db = body.use_db;

        const tp_param = body.tp_price;
        const sl_param = body.sl_price;

        // Setting stop_loss and tp base on current Ticker
        const find_trade = await Trade_status.findOne({ symbol: body.symbol });

        if (find_trade == null || !find_trade) {
            return res.status(200).send({
                msg: `Meta data of the current Trade with symbol(${symbol}) is not availble.`,
                code: "RED",
            });
        }

        if (status == "SL" && find_trade["stop_loss"] == undefined) {
            return res
                .status(200)
                .send({ msg: "Stop_loss is not availalbe", code: "RED" });
        }

        if (status == "TP" && find_trade["take_profit"] == undefined) {
            return res
                .status(200)
                .send({ msg: "Take_profit is not availalbe", code: "RED" });
        }

        if (status == "TP") {
            set_value = find_trade.take_profit;
        } else if (status == "SL") {
            set_value = find_trade.stop_loss;
        }

        // Set TP/SL manually
        if (use_db == false && status == "TP") {
            set_value = tp_param;
        } else if (use_db == false && status == "SL") {
            set_value = sl_param;
        }

        const meta_data_tp = {
            symbol: find_trade.symbol,
            status: status,
            side: find_trade.side,

            positionSide: "BOTH",
            limitprice: parseFloat(find_trade.limitprice),
            stopPrice: set_value,
            quantity: parseFloat(find_trade.quantity),
        };

        const data = await set_tp_sl(meta_data_tp);

        if (data == null || !data) {
            console.log("Data is null");
            return res.status(200).send({ msg: "No data found", code: "NULL" });
        }

        // Return data directly in the response
        return res.status(201).send({
            msg: `${status} has updated for ${find_trade.symbol}...`,
            code: "GREEN",
        });
    } catch (err) {
        console.error("Trade order does not work properly:", err);
        return res.status(500).send({ msg: "Server error", code: 400 });
    }
});

// Trade Order
router.post("/Reverse_pos", async (req, res) => {
    const { body } = req;

    try {
        const find_current_trade = await Trade_status.find({ symbol: body.symbol });

        // Common error on handling database current position meta data
        if (find_current_trade == undefined || !find_current_trade) {
            return res
                .status(200)
                .send("Current trade does not exist in the database");
        }

        
        const orderId = body.orderId;
        const symbol = find_current_trade[0].symbol;
        const quantity = find_current_trade[0].quantity;
        let side = find_current_trade[0].side;

        if (side.toString() == "BUY") {
            side = "SELL";
        } else if (side.toString() == "SELL") {
            side = "BUY";
        }

        const open_reversed_params = {
            symbol: symbol,
            side: side,
            quantity: quantity,
        };

        // Close Current Position before reversing it
        const Close_current_pos = await close_position_orders(orderId);

        // Open Reverse Position
        const Rever_res = await Reverse_order(open_reversed_params);

        return res.send("Reverse positon Done");
    } catch (err) {
        console.error("Trade order does not work properly:", err);
        return res.status(500).send({ msg: "Server error" });
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------PENDING/POSITION STATUS----------------------------------------------------------------------------

// All pending Orders
router.get("/all_pending_orders", async (req, res) => {
    const { body } = req;
    try {
        const obj = await all_pending_orders();
        return res.status(200).send({ msg: "Getting pending orders", data: obj });
    } catch (err) {
        console.log("Pending Orders functions does not working properly. ", err);
    }
});

// // All Orders
// router.get("/full_order", async (req, res) => {

//     const { body } = req;
//     try {

//         const data = await all_orders()
//         return res.status(200).send({ "msg": "Full_orders", "data": data })
//     } catch (err) {
//         console.log("gettign All Orders functions does not working properly. ", err)
//     }
// });

// All open Position
router.get("/all_open_position", async (req, res) => {
    const { body } = req;

    try {
        const data = await all_positon_orders();
        return res
            .status(200)
            .send({ msg: "Getting All Position/Pending orders", data: data });
    } catch (err) {
        console.log("all_position_orders functions does not working properly", err);
    }
});

//  Closing current pending order
router.delete("/close_pending_orders", async (req, res) => {
    const { body } = req;

    try {
        const ID = parseInt(body.orderId);

        const data = await close_pending_orders(ID);
        // console.log(Object.keys(data))
        return res.status(200).send({ msg: "Deleting Pending_order ", data: data });
    } catch (err) {
        res
            .sendStatus(400)
            .send({ msg: `Trade_order does not working properly \n ${err}` });
    }
});

// Closing current Position
router.delete("/close_position_orders", async (req, res) => {
    const { body } = req;

    try {
        const ID = parseInt(body.orderId);

        const data = await close_position_orders(ID);

        return res
            .status(200)
            .send({ msg: "Deleting Position_order ", data: data });
    } catch (err) {
        res.sendStatus(400).send({
            msg: `Deleting method on clsoe Position does not working! \n ${err}`,
        });
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------Meta data Validation--------------------------------------------------------------------

// record_trade_history
router.get("/update_trade_history", async (req, res) => {
    try {
        const trade_history = await Trade_history();

        if (!trade_history || trade_history.length === 0) {
            return res.status(200).send("Trade_history API endpoint is broken, please check the API router again..");
        }

        const res_filter = trade_history.filter(
            (item) => item.status === "FILLED" && parseFloat(item.profit) !== 0.0
        );

        const mapped_obj = res_filter.sort((a, b) => b.time - a.time);

        console.log(chalk.blue("Processing the Trade_history..."));

        const savePromises = mapped_obj.map(async (element) => {
            const existingRecord = await trade_history_model.findOne({
                orderId: parseFloat(element.orderId),
            });

            if (!existingRecord) {
                const new_trade_history_record = new trade_history_model({
                    symbol: element.symbol,
                    orderId: element.orderId,
                    side: element.side,
                    profit: element.profit,
                    type: element.type,
                    price: element.price,
                    time: element.time,
                    leverage: element.leverage,
                });

                await new_trade_history_record.save();
            }
        });

        await Promise.all(savePromises); // Wait for all save operations to complete

        console.log(chalk.green("Trade_History Table is updated"));
        return res.status(200).send("Trade_History Table is updated...");
    } catch (err) {
        console.error(`Error saving trade history: ${err.message}`);
        return res.status(500).send("An error occurred while updating trade history.");
    }
});


// get_trade_history from db
router.get("/trade_history/all", async (req, res) => {
    try {
        const Trade_history = await trade_history_model.find();

        if (!Trade_history || Trade_history == null) {
            return res
                .status(200)
                .send("Trade history is empty, please check the db");
        }

        return res.status(200).send({ data: Trade_history });
    } catch (err) {
        console.error(`Error saving trade history: ${err.message}`);
    }
});

// get meta data of current trade
router.post("/Trade_status/get_symbol", async (req, res) => {
    const { body } = req;

    try {
        // Body symbol {params}
        const symbol_name = body.symbol;
        const find_ticker = await Trade_status.findOne({ symbol: symbol_name });

        // Check if ticker was found
        if (!find_ticker) {
            // Fixing condition: findOne returns null if not found
            return res.send(`Data(${symbol_name}) does not exist in DB!`);
        }

        // If found, return the data
        return res.status(200).send({ msg: "Data does exist", data: find_ticker });
    } catch (err) {
        res.status(400).send({
            msg: `Something went wrong while getting the symbol table! \n ${err}`,
        });
    }
});


// get meta data of current trade
router.get("/Trade_status/get_all", async (req, res) => {
    const { body } = req;

    try {
        
        const Trade_record = await Trade_status.find();
        // Check if ticker was found
        if (!Trade_record) {
            // Fixing condition: findOne returns null if not found
            return res.send(`trade_record does not exist in DB!`);
        }

        // If found, return the data
        return res.status(200).send({ msg: "Data does exist", data: Trade_record });
    } catch (err) {
        res.status(400).send({
            msg: `Something went wrong while getting the Trade_record table! \n ${err}`,
        });
    }
});

// Saving meta data of current trade into db
router.post("/save_trade", async (req, res) => {
    const { body } = req;
    try {
        // first validation to check the symbol is USDT or not
        if (body.symbol && !body.symbol.endsWith("-USDT")) {
            return res
                .status(400)
                .send({ msg: "please Add the -USDT to the end of the symbol" });
        }
        // Validation to make sure the symbol is Uppercase
        if (body.symbol !== body.symbol.toUpperCase()) {
            return res
                .status(400)
                .send({ msg: "symbol from params is not Uppercase" });
        }

        // Check if the symbol already exists in the database
        const existingTrade = await Trade_status.findOne({ symbol: body.symbol });

        if (existingTrade || existingTrade != null) {
            console.log("Symbol already exists in the database");
            return res.status(400).send({ msg: "symbol already exist in the db" });
        } else {
            // Creating the new instance of meta data
            const newTrade = new Trade_status({
                symbol: body.symbol,
                stop_loss: body.stop_loss,
                take_profit: body.take_profit,
                limitprice: body.limitprice,

                risk : body.risk,
                quantity: body.quantity,
                quantity_dollar : body.quantity_dollar,

                side: body.side,
                position_type : body.position_type,
            });

            await newTrade.save();
            return res
                .status(201)
                .send({ msg: "meta data is saved!", data: [newTrade] });
        }
    } catch (error) {
        console.error(
            
            "Error inserting or checking for duplicate symbol:",
            error.errorResponse
        );
        res.status(400).send("Internal server error");
    }
});

//  Deleting symbol table
router.delete("/Trade_status/delete_symbol", async (req, res) => {
    const { symbol } = req.query; // Use query parameters

    try {
        // find the meta data by symbol
        const find_symbol_data = await Trade_status.findOne({ symbol: symbol });

        console.log(find_symbol_data);

        //   symbol does not  exist
        if (
            !find_symbol_data ||
            find_symbol_data == null ||
            find_symbol_data.length == 0
        ) {
            return res.status(200).send("symbol does not exist to remvoe it...");
        }
        // incorrect way passing symbol param into deleting symbol from trades table
        if (
            (symbol && !symbol.endsWith("-USDT")) ||
            symbol !== symbol.toUpperCase()
        ) {
            return res
                .status(200)
                .send(
                    "symbol isn't correct. fix the passing correct params to the endpoint"
                );
        }

        //  delete the symbol table
        const delete_by_symbol = await Trade_status.deleteOne({ symbol: symbol });

        console.log(chalk.red(`Removing  ${symbol} from trades Table`));
        return res
            .status(200)
            .send({ msg: `${symbol} is removed from the trades Table` });
    } catch (err) {
        res
            .status(400)
            .send({ msg: `Deleting method by symbol does not working! \n ${err}` });
    }
});

// Closing current Position
router.delete("/Trade_status/delete_all", async (req, res) => {
    const { body } = req;
    try {
        const delete_all_res = await Trade_status.deleteMany();

        console.log(chalk.red("Table is Deleted entirely"));
        return res.status(200).send({ msg: "Table is Deleted entirely" });
    } catch (err) {
        res
            .sendStatus(400)
            .send({ msg: `Deleting_all method does not working! \n ${err}` });
    }
});

setInterval(() => { }, 10000);

const bingx_router = router;

export default bingx_router;
