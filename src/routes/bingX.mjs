

import express, { response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import chalk from 'chalk';
const router = express.Router();

// BingX importing modules
import trade_order from '../bingxapi/trade_order.mjs';

import all_positon_orders from '../bingxapi/all_open_positions.mjs';
import all_pending_orders from '../bingxapi/all_pending_orders.mjs';
import close_pending_orders from '../bingxapi/close_pending_orders.mjs';
import close_position_orders from '../bingxapi/close_open_positions.mjs';
import all_orders from '../bingxapi/all_orders.mjs';
import crpyto_list from '../bingxapi/crypto_list_api.mjs';
import Trade_status from '../mongoose/schemas/meta_data.mjs';
import set_tp_sl from '../bingxapi/set_tp_sl.mjs';





// import taskQueue from '../Task/queue.mjs';
// import { Pending_position_status, Merging_data } from '../Task/Tasks.mjs';



import Crypto_list_model from '../mongoose/schemas/cryptolistschemas.mjs';

dotenv.config({ path: '../.env' });  // Load environment variables

// Get Crypto list from db
router.get('/crypto_list', async (req, res) => {
    try {
        const obj = await crpyto_list();

        return res.status(200).send(obj);

    } catch (err) {
        console.log('Crypto_list does not work... ', err);
        return res.status(500).send({ msg: 'Server error' });
    }
});

// Post the data into DB
router.post('/crypto_list', async (req, res) => {
    const { body } = req;

    try {
        const db_crypto_list = await Crypto_list_model.find();

        if (typeof db_crypto_list !== 'undefined' && db_crypto_list.length === 0) {
            console.log('No existing data found, fetching from BingX...');

            // Fetch data from the external API
            const crypto_list_bingx = await axios.get('http://localhost:3005/api/crypto_list');
            const newCryptoData = await crypto_list_bingx.data;

            console.log('data is here....', newCryptoData)

            newCryptoData.forEach(element => {

                const newCryptoEntry = new Crypto_list_model({
                    symbol: element,
                });
                newCryptoEntry.save();
            });

            // After saving, fetch the updated data from the DB
            const db_query_crypto_list = await Crypto_list_model.find();
            return res.status(201).send({ msg: "Data is- updated", data: db_query_crypto_list });

        } else {
            // If data exists, return the existing data from the database
            return res.status(200).send({ msg: "Data already exists", data: db_crypto_list });
        }
    } catch (err) {
        console.error('Error processing crypto list:', err);
        return res.status(400).json({ msg: 'Server error' });
    }
});


// ------------------------------------------------------OPENING TRADES---------------------------------------------------------------------------------

// Trade Order
router.post('/trade_order', async (req, res) => {
    const { body } = req;
    try {
        const data = await trade_order(body);

        if (data == null) {
            console.log('Data is null');
            return res.status(400).send({ msg :"No data found" });
        }

        // Return data directly in the response
        return res.status(201).json({
            msg: "Trade is Created...",
            data: data.data
        });

    } catch (err) {
        console.error('Trade order does not work properly:', err);
        return res.status(500).send({ msg: 'Server error' });
    }
});


// Trade Order
router.post('/set_sl_tp', async (req, res) => {
    const { body } = req;
    try {

        // Setting stop_loss and tp base on current Ticker
        const find_user  = await Trade_status.findOne({symbol : body.symbol})

        // stauts of setting stop or profit 
        const status = body.status;
        let  set_value  = null; 
        
        if(status == "TP"){
            set_value = find_user.take_profit

        }else if(status == "SL"){
            set_value = find_user.stop_loss
        }

        
        const meta_data_tp = {

            "symbol": find_user.symbol,
            "status": status,
            "side":  find_user.side,

            "positionSide": "BOTH",
            "limitprice": parseFloat(find_user.limitprice),
            "stopPrice": set_value ,
            "quantity": parseFloat(find_user.quantity)
        }

        const data = await set_tp_sl(meta_data_tp);

        if (data == null) {
            console.log('Data is null');
            return res.status(400).send({ msg: 'No data found' });
        }

        // Return data directly in the response
        return res.status(201).json({
            msg: "Trade is Created...",
            data: data.data
        });

    } catch (err) {
        console.error('Trade order does not work properly:', err);
        return res.status(500).send({ msg: 'Server error' });
    }
});


// ------------------------------------------------------PENDING/POSITION STATUS----------------------------------------------------------------------------
// All pending Orders
router.get("/all_pending_orders", async (req, res) => {

    const { body } = req;
    try {

        const obj = await all_pending_orders()
        return res.status(200).send({ msg: "Getting pending orders", data: obj })
    } catch (err) {
        console.log("Pending Orders functions does not working properly. ", err)
    }
});


// All Orders
router.get("/full_order", async (req, res) => {

    const { body } = req;
    try {

        const data = await all_orders()
        return res.status(200).send({ "msg": "Full_orders", "data": data })
    } catch (err) {
        console.log("gettign All Orders functions does not working properly. ", err)
    }
});

// All open Position
router.get("/all_open_position", async (req, res) => {
    const { body } = req;

    try {

        const data = await all_positon_orders()
        return res.status(200).send({ "msg": "Getting All Position/Pending orders", "data": data })
    } catch (err) {
        console.log("all_position_orders functions does not working properly", err)
    }
});

//  Closing current pending order
router.delete("/close_pending_orders", async (req, res) => {
    const { body } = req;

    try {

        const ID = parseInt(body.orderId);

        const data = await close_pending_orders(ID);
        // console.log(Object.keys(data))
        return res.status(200).send({ "msg": "Deleting Pending_order ", "data": data })
    } catch (err) {

        res.sendStatus(400).send({ "msg": `Trade_order does not working properly \n ${err}` });
    }
});

// Closing current Position
router.delete("/close_position_orders", async (req, res) => {
    const { body } = req;

    try {
        const ID = parseInt(body.orderId);

        const data = await close_position_orders(ID);

        return res.status(200).send({ "msg": "Deleting Position_order ", "data": data })
    } catch (err) {

        res.sendStatus(400).send({ "msg": `Deleting method on clsoe Position does not working! \n ${err}` });
    }
});




// ------------------------------------------------------Meta data Validation--------------------------------------------------------------------


// get meta data of current
router.post("/Trade_status/get_symbol", async (req, res) => {
    const { body } = req;

    try {
        // Body symbol {params}
        const symbol_name = body.symbol; 
        
        const find_ticker = await Trade_status.findOne({symbol: symbol_name});
        
        // Check if ticker was found
        if (!find_ticker) {  // Fixing condition: findOne returns null if not found
            return res.send(`Data(${symbol_name}) does not exist in DB!`)
        }

        // If found, return the data
        return res.status(200).send({ msg: "Data does exist", data: find_ticker });

    } catch (err) {
        // Fix: Do not chain `sendStatus(400)` with `.send()`
        res.status(400).send({ msg: `Something went wrong while getting the symbol table! \n ${err}` });
    }
});


// Saving meta data of current trade into db
router.post("/Trade_status", async (req, res) => {

    const { body } = req;

    try {

        // first validation to check the symbol is USDT or not
        if (body.symbol && !body.symbol.endsWith('-USDT')) {
            return res.status(400).send({msg: "please Add the -USDT to the end of the symbol" })
        }
        // Validation to make sure the symbol is Uppercase
        if (body.symbol !== body.symbol.toUpperCase()  ) {
            return res.status(400).send({msg: "symbol from params is not Uppercase" })
        }

        // Check if the symbol already exists in the database
        const existingTrade = await Trade_status.findOne({ symbol: body.symbol });

        if(existingTrade || existingTrade!= null ){
            console.log("Symbol already exists in the database");
            return res.status(400).send({msg: "symbol already exist in the db" })
        }else{

            // Creating the new instance of meta data 
            const newTrade = new Trade_status({
                symbol: body.symbol ,
                stop_loss: body.stop_loss,
                take_profit : body.take_profit,
                limitprice: body.limitprice,
                quantity : body.quantity,
                side: body.side,

            
            });

            await newTrade.save();
            return res.status(201).send({msg: "meta data is saved!" ,data : [newTrade] })
        }

    } catch (error) {
        console.error("Error inserting or checking for duplicate symbol:", error.errorResponse  );
        res.status(400).send("Internal server error");
    }
});

// Delete per Symbol


router.delete("/Trade_status/delete_symbol", async (req, res) => {


    const { symbol } = req.query;  // Use query parameters

    try {
        
        
        // find the meta data by symbol
        const find_symbol_data  = await Trade_status.findOne({symbol : symbol  });
        
        console.log(find_symbol_data)

        //   symbol does not  exist
        if (!find_symbol_data || find_symbol_data == null || find_symbol_data.length == 0  ) {
            return res.status(200).send( "symbol does not exist to remvoe it..." )
        }
        // incorrect way passing symbol param into deleting symbol from trades table
        if (symbol && !symbol.endsWith('-USDT') ||  symbol !== symbol.toUpperCase()  ) {
            return res.status(200).send( "symbol isn't correct. fix the passing correct params to the endpoint" )
        }

        
        //  delete the symbol table 
        const delete_by_symbol  = await Trade_status.deleteOne({ symbol : symbol  });

        console.log(chalk.red(`Removing  ${symbol} from trades Table`))
        return res.status(200).send({ msg: `${symbol} is removed from the trades Table` })
    } catch (err) {

        res.status(400).send({ "msg": `Deleting method by symbol does not working! \n ${err}` });

    }});



// router.delete("/Trade_status/delete_symbol", async (req, res) => {

//     const { body } = req;

//     try {
             
//         console.log(body)
// // delete symbol
//         const delete_by_symbol  = await Trade_status.deleteOne({ symbol : symbol  });



//       
//     }
// });


// Closing current Position
router.delete("/Trade_status/delete_all", async (req, res) => {

    const { body } = req;
    try {
         
        const delete_all_res = await Trade_status.deleteMany();


        console.log(chalk.red("Table is Deleted entirely")) 
        return res.status(200).send({ msg: "Table is Deleted entirely" })
    } catch (err) {

        res.sendStatus(400).send({ "msg": `Deleting_all method does not working! \n ${err}` });
    }
});




const bingx_router = router;


export default bingx_router;

