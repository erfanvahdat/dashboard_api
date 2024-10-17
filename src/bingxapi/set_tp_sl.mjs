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

    // reading params body data 
    let type = null;
    const symbol = orderParams.symbol;
    const status = orderParams.status;
    const limitprice = orderParams.limitprice;
    const stopprice  = orderParams.stopPrice;
    const quantity = orderParams.quantity;

    if(status  == "SL" ){
        type =  "STOP_MARKET"
    }else{
        type =  "TAKE_PROFIT_MARKET"
    }

    const HOST = "open-api.bingx.com";

    const API = {
        uri: "/openApi/swap/v2/trade/order",
        method: "POST",
        payload: {
        
            "symbol": symbol ,
            "type":type ,
            "side":"BUY",
            "positionSide":"BOTH",
            "price":limitprice,
            "stopPrice":stopprice,
            "quantity": quantity ,
        
        },
        protocol: "https",
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

        // const data = resp.data;

        return await resp;

        // console.log("Response status:", resp.status);
    } catch (error) {
        console.error("Error during API request:", error);
    }
}


// Function to run the API call and export the data
async function set_tp_sl(orderParams) {
    try {
        // Call the API with the provided params
        const tradeOrderResult = await main(orderParams);
        return tradeOrderResult;
    } catch (error) {
        console.error("Error setting stop/profit data:", error);
        return null;
    }
}

// Example usage: Call the function by passing the orderParams object
// const data = await set_tp_sl('a');

// console.log(data)
export default set_tp_sl;
