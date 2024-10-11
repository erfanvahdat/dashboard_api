

import express from 'express';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import dotenv from 'dotenv';
// import db from '../database/db.mjs'; 




import trade_order from '../bingxapi/trade_order.mjs';

import all_positon_orders from '../bingxapi/all_open_positions.mjs';
import all_pending_orders from '../bingxapi/all_pending_orders.mjs';


import close_pending_orders from '../bingxapi/close_pending_orders.mjs';
import close_position_orders from '../bingxapi/close_open_positions.mjs';


dotenv.config({ path: '../.env' });  // Load environment variables


const router = express.Router();



router.post('/trade_order', async (req, res) => {
    const { body } = req;

    try {

        const data = await trade_order(body);


        res.status(201).send({ "msg": "Trade is Created...", "data": data })
    } catch (err) {
        console.log('Trade_order does not working properly ', err)
    }
});

router.get("/all_pending_orders", async (req, res) => {

    const { body } = req;
    try {

        const data = await all_pending_orders()
        return res.status(200).send({ "msg": "Getting pending orders", "data": data })
    } catch (err) {
        console.log("Trade_order does not working properly", err)
    }
});


router.get("/all_position_orders", async (req, res) => {
    const { body } = req;

    try {

        const data = await all_positon_orders()
        return res.status(200).send({ "msg": "Getting Position orders", "data": data })
    } catch (err) {
        console.log("Trade_order does not working properly", err)
    }
});


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



// router.get('/status', (req, res) => {
//     res.send('GET request to the API')
// })

// router.get('/status', (req, res) => {
//     res.send('GET request to the API')
// })


const bingx_router = router;
export default bingx_router;
