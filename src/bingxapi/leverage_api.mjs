import axios from "axios";
import dotenv from 'dotenv'; 
import CryptoJS from "crypto-js";

// Load environment variables
dotenv.config(); 

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;
const HOST = "open-api.bingx.com";

// Leverage function
async function Leverage(symbol, leverage) {
    const API = {
        "uri": "/openApi/swap/v2/trade/leverage",
        "method": "POST",
        "payload": {
            "leverage": leverage,
            "side": "BOTH",
            "symbol": symbol
        },
        "protocol": "https"
    };

    return await bingXOpenApiTest(API, API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET);
}

// Helper function to get parameters
function getParameters(API, timestamp, urlEncode = false) {
    let parameters = "";
    for (const key in API.payload) {
        if (urlEncode) {
            parameters += key + "=" + encodeURIComponent(API.payload[key]) + "&";
        } else {
            parameters += key + "=" + API.payload[key] + "&";
        }
    }
    parameters += "timestamp=" + timestamp;
    return parameters;
}

// Function to handle the API request
async function bingXOpenApiTest(API, protocol, host, path, method, API_KEY, API_SECRET) {
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
        console.log("Response status:", resp.status);
        return resp.data;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}

// Function to switch leverage
export async function switch_leverage(symbol, leverage) {
    try {
        const leverageResponse = await Leverage(symbol, leverage);
        return leverageResponse; // Return the data received from the Leverage function
    } catch (error) {
        console.error("Error switching leverage:", error);
        return null;  // Return null if an error occurs
    }
}



export default switch_leverage;


// // Call the switch_leverage function with symbol and leverage
// switch_leverage('DOT-USDT', '8').then(data => {
//     console.log("Leverage switched, data received:", data);
// }).catch(error => {
//     console.error("Error during leverage switch:", error);
// });


