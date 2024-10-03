

import express from 'express';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import dotenv from 'dotenv';
// import db from '../database/db.mjs'; 

dotenv.config({ path: '../.env' });  // Load environment variables

const router = express.Router();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const HOST = 'open-api.bingx.com';


const API = {
    uri: '/openApi/swap/v3/user/balance',
    method: 'GET',
    payload: {
        timestamp: '1702731518913',
    },
    protocol: 'https',
};


router.get('/status', (req, res) => {
  res.send('GET request to the API')
})

// Helper function to generate the query string and signature
function getParameters(API, timestamp, urlEncode) {
    let parameters = '';
    for (const key in API.payload) {
        if (urlEncode) {
            parameters += key + '=' + encodeURIComponent(API.payload[key]) + '&';
        } else {
            parameters += key + '=' + API.payload[key] + '&';
        }
    }
    if (parameters) {
        parameters = parameters.substring(0, parameters.length - 1);
        parameters += '&timestamp=' + timestamp;
    } else {
        parameters = 'timestamp=' + timestamp;
    }
    return parameters;
}

// Function to call the BingX API
async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET) {
    const timestamp = new Date().getTime();
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET));
    const url = `${protocol}://${host}${path}?${getParameters(API, timestamp, true)}&signature=${sign}`;

    const config = {
        method: method,
        url: url,
        headers: {
            'X-BX-APIKEY': API_KEY,
        },
        transformResponse: (resp) => {
            console.log(resp);  // Output original response for debugging
            return resp;
        },
    };

    const resp = await axios(config);
    console.log('Status:', resp.status);
    console.log('Data:', resp.data);

    return resp.data;  // Return the balance data from BingX API
}


// Define the route to fetch balance and store in DB
router.get('/bingx-balance', async (req, res) => {
    try {
        // Ensure the 'balance' table exists
        // await ensureBalanceTable();

        console.log('we are here')
        // Fetch balance data from BingX API
        const balanceData = await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET);

        // Insert the balance data into the database with a timestamp
        // const insertQuery = `
        //     INSERT INTO balance (balance_data)
        //     VALUES ($1)
        //     RETURNING *;
        // `;

        // const result = await db.one(insertQuery, [balanceData]);

        res.status(200).json({
            message: `Balance data saved to database${balanceData}`,

            data: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch or save data' });
    }
});

export default router;
