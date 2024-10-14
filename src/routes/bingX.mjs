

import express, { response } from 'express';
import dotenv from 'dotenv';
const router = express.Router();
import axios from 'axios';


// BingX importing modules
import trade_order from '../bingxapi/trade_order.mjs';

import all_positon_orders from '../bingxapi/all_open_positions.mjs';
import all_pending_orders from '../bingxapi/all_pending_orders.mjs';
import close_pending_orders from '../bingxapi/close_pending_orders.mjs';
import close_position_orders from '../bingxapi/close_open_positions.mjs';
import all_orders from '../bingxapi/all_orders.mjs';
import crpyto_list from '../bingxapi/crypto_list_api.mjs';

import Crypto_list_model from '../mongoose/schemas/cryptolistschemas.mjs';

dotenv.config({ path: '../.env' });  // Load environment variables






// Get Crypto list from db
router.get('/crypto_list', async (req, res) => {
    try {
        const obj = await crpyto_list();

        return res.status(200).send( obj );

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
            const newCryptoData = await crypto_list_bingx.data ;

            console.log('data is here....', newCryptoData)

            newCryptoData.forEach(element => {

                const newCryptoEntry = new Crypto_list_model({
                    symbol: element,
                });
                newCryptoEntry.save();
            });


            // After saving, fetch the updated data from the DB
            const db_query_crypto_list = await Crypto_list_model.find();
            return res.status(201).send({ msg: "Data is updated", data: db_query_crypto_list });
            
        } else {
            // If data exists, return the existing data from the database
            return res.status(200).send({ msg: "Data already exists", data: db_crypto_list });
        }
    } catch (err) {
        console.error('Error processing crypto list:', err);
        return res.status(400).json({ msg: 'Server error' });
    }
});




// Trade Order
router.post('/trade_order', async (req, res) => {
    const { body } = req;
    try {
        const data = await trade_order(body);

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


const bingx_router = router;


export default bingx_router;
