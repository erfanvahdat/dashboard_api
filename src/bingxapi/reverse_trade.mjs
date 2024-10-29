import axios from "axios";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";
import switch_leverage from "./leverage_api.mjs";

// Load environment variables
dotenv.config();

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;

async function main(orderParams) {
    const { symbol, side, quantity } = orderParams;

    // Check for missing required fields

    if (!symbol || !side || !quantity) {
        console.error('Missing required parameters in orderParams');
        // return { error: 'Missing required parameters', status: 400 };
        console.log('we are here on error')
        throw new Error("Missing required parameters")
    }

    const HOST = "open-api.bingx.com";
    const API = {
        uri: "/openApi/swap/v2/trade/order",
        method: "POST",
        payload: {
            symbol: symbol ,
            side: side ,
            positionSide: "BOTH" ,
            type: "MARKET" ,
            quantity : quantity  ,
            
        },
        protocol: "https"
    };

    return await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET, API);
}

function getParameters(API, timestamp, urlEncode = false) {
    let parameters = "";
    for (const key in API.payload) {
        if (urlEncode) {
            parameters += `${key}=${encodeURIComponent(API.payload[key])}&`;
        } else {
            parameters += `${key}=${API.payload[key]}&`;
        }
    }

    if (parameters) {
        parameters = parameters.slice(0, -1);
        parameters += `&timestamp=${timestamp}`;
    } else {
        parameters = `timestamp=${timestamp}`;
    }
    return parameters;
}

async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET, API) {
    const timestamp = new Date().getTime();
    const signaturePayload = getParameters(API, timestamp);
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(signaturePayload, API_SECRET));
    const url = `${protocol}://${host}${path}?${getParameters(API, timestamp, true)}&signature=${sign}`;

    try {
        const config = {
            method,
            url,
            headers: {
                'X-BX-APIKEY': API_KEY,
            },
            transformResponse: (resp) => {

                return resp;
            }
        };
        const resp = await axios(config);

        return await resp;

        // console.log("Response status:", resp.status);
    } catch (error) {
        console.error("Error during API request:", error);
    }
}

// Function to run the API call and export the data
async function reverse_order(orderParams) {
    try {
        // Call the API with the provided params
        const tradeOrderResult = await main(orderParams);
        return tradeOrderResult;
    } catch (error) {
        console.error("Error executing trade order:", error);
        return null;
    }
}

// Example usage: Call the function by passing the orderParams object
// const data = await reverse_order(orderParams);

// console.log(data)
export default reverse_order;
