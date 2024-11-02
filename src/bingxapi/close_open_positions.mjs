

import axios from "axios";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";

// Load environment variables
dotenv.config();

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;


async function main(positionId) {


    const id = BigInt(positionId)
    const id_str = id.toString()


    const HOST = "open-api.bingx.com";
    const API = {
        uri: "/openApi/swap/v1/trade/closePosition",
        method: "POST",
        payload: {
            positionId: id_str,
        },
        protocol: "https"
    };

    // Now, call bingXOpenApiTest with the complete API object and positionId
    await bingXOpenApiTest(API, HOST, API.method, API_KEY, API_SECRET);
}

function getParameters(API, timestamp, urlEncode = false) {
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
        parameters = parameters + "&timestamp=" + timestamp;
    } else {
        parameters = "timestamp=" + timestamp;
    }
    return parameters;
}

async function bingXOpenApiTest(API, host, method, API_KEY, API_SECRET) {
    const timestamp = new Date().getTime();
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET));
    const url = API.protocol + "://" + host + API.uri + "?" + getParameters(API, timestamp, true) + "&signature=" + sign;

    console.log("URL:", url);

    const config = {
        method: method,
        url: url,
        headers: {
            'X-BX-APIKEY': API_KEY,
        },
        transformResponse: (resp) => {
            console.log(resp);
            return resp;
        }
    };

    try {
        const resp = await axios(config);
        console.log("Status:", resp.status);
        return resp.data;
    } catch (error) {
        console.error("Error with API request:", error);
    }
}

// Function to run the API call and export the data
async function close_position_orders(positionId) {
    try {
        const response = await main(positionId); 
        return response;
    } catch (error) {
        console.error("Error exporting open orders:", error);
        return null;
    }
}

// Test the function
// close_position_orders(1844632929297649700);

export default close_position_orders;


