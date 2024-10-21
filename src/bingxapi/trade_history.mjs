import axios, { all } from "axios";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";

// Load environment variables
dotenv.config();

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;

// current datetime
const now = new Date().getTime();

//  Five days ago
const fiveDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

const starttime  =  fiveDaysAgo.getTime();
const  endtime  = now;

const HOST = "open-api.bingx.com";
const API = {
    "uri": "/openApi/swap/v1/trade/fullOrder",
    "method": "GET",
    "payload": {
        "endTime": endtime,
        "limit": "500",
        "startTime": starttime,
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
        // const json_parse_res = JSON.parse(resp.data)

        // console.log()
        return resp.data;

    } catch (error) {
        console.error("Error with API request:", error);
    }
}

async function Trade_history() {
    const all_orders = await main();
    const orders = all_orders['data']['orders']
    return orders;
}

// const obj = await Trade_history();
// console.log(obj)

export default Trade_history;
