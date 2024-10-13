import axios, { all } from "axios";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";

// Load environment variables
dotenv.config();

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;

const HOST = "open-api.bingx.com";
const API = {
    "uri": "/openApi/swap/v1/trade/fullOrder",
    "method": "GET",
    "payload": {
        "endTime": "1702731995000",
        "limit": "500",
        "startTime": "1702688795000",
    },
    "protocol": "https"
};

async function main() {
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
    if (parameters) {
        parameters = parameters.substring(0, parameters.length - 1);
        parameters += "&timestamp=" + timestamp;
    } else {
        parameters = "timestamp=" + timestamp;
    }
    return parameters;
}

async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET) {
    const timestamp = new Date().getTime();
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET));
    const url = `${protocol}://${host}${path}?${getParameters(API, timestamp, true)}&signature=${sign}`;

    console.log("Generated URL:", url);

    const config = {
        method: method,
        url: url,
        headers: {
            'X-BX-APIKEY': API_KEY,
        }
    };

    try {
        const resp = await axios(config);
        console.log("Status:", resp.status);

        return resp.data;  // Parse the response to convert it into a JS object

    } catch (error) {
        console.error("Error with API request:", error);
    }
}

async function all_orders() {
    const all_orders = await main();
    const orders = all_orders['data']['orders']
    return orders;
}

// const obj = await all_orders();

export default all_orders;

// console.log(obj)
// Log only the orders in a pretty format
// console.log(JSON.stringify(obj, null, 2));
// const obj_filter = obj.filter(item => item.symbol ==='SAND-USDT')
// console.log(obj_filter[0].orderId)

// console.log(obj_filter[0].orderId)
