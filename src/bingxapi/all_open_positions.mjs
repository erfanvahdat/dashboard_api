


import axios from "axios";
import dotenv from 'dotenv'; 

import CryptoJS from "crypto-js";

// Load environment variables
dotenv.config(); 

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;

async function main() {
    const HOST = "open-api.bingx.com";

    const API = {           
        "uri": "/openApi/swap/v2/user/positions",

        "method": "GET",
        "payload": {
            
            // "startTime": "1702688795000",
        },
        "protocol": "https"
    };

    // Pass API as an argument to the function
    return await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET, API);
}

function getParameters(API, timestamp, urlEncode) {
    let parameters = "";
    for (const key in API.payload) {
        if (urlEncode) {
            parameters += key + "=" + encodeURIComponent(API.payload[key]) + "&";
        } else {
            parameters += key + "=" + API.payload[key] + "&";
        }
    }
    // Append timestamp to parameters
    parameters += "timestamp=" + timestamp;
    return parameters;
}

async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET, API) {
    const timestamp = new Date().getTime();
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET));
    const url = `${protocol}://${host}${path}?${getParameters(API, timestamp, true)}&signature=${sign}`;
    
    console.log("protocol:", protocol);
    console.log("method:", method);
    console.log("host:", host);
    console.log("path:", path);
    console.log("parameters:", getParameters(API, timestamp));
    console.log("sign:", sign);
    console.log(method, url);

    const config = {
        method: method,
        url: url,
        headers: {
            'X-BX-APIKEY': API_KEY,
        },
    };

    try {
        const resp = await axios(config);
        console.log("Response Status:", resp.status);

        return resp.data; // Return the response data
    } catch (error) {
        console.error("API call error:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

// Function to run the API call and export the data
async function all_positon_orders() {
    try {
        const open_orders = await main();
        return open_orders.data;  
    } catch (error) {
        console.error("Error exporting open orders:", error);
        return null;  
    }
}


// const data = await all_open_orders()

// console.log(data )
export default all_positon_orders;