


import axios from "axios";
import dotenv from 'dotenv'; 
import CryptoJS from "crypto-js";


// Load environment variables
dotenv.config(); 

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;
const HOST = "open-api.bingx.com";
const API = {
    "uri": "/openApi/swap/v3/user/balance",
    "method": "GET",
    "payload": {},
    "protocol": "https"
};

// Function to build parameters with timestamp and optional URL encoding
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
    }
    parameters += "&timestamp=" + timestamp;
    return parameters;
}

// Function to call the BingX API and extract userId, balance, and equity values
async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET) {
    try {
        const timestamp = new Date().getTime();
        const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET));
        const url = `${protocol}://${host}${path}?${getParameters(API, timestamp, true)}&signature=${sign}`;
        
        const config = {
            method: method,
            url: url,
            headers: {
                'X-BX-APIKEY': API_KEY,
            }
        };

        const resp = await axios(config);
        
        // Extract the relevant data from the API response
        const data = resp.data.data.map(item => {
            return {
                userId: item.userId,
                asset: item.asset,
                balance: item.balance,
                equity: item.equity
            };
        });
        
        // Exportable data
        return data;

    } catch (error) {
        console.error(101, error);
        throw new Error("Failed to fetch data from BingX API");
    }
}

// Function to run the API call and export the data
export async function getBalanceData() {
    try {
        const balanceData = await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET);
        return balanceData;  // Return the raw balance data (no need to use .json() as it's already an object in axios)
    } catch (error) {
        console.error("Error exporting balance data:", error);
        return null;  // Return null or handle error as needed
    }
}




const data = await getBalanceData();
// console.log()
const balance_api = data.find(item => item.asset === 'USDT')

export default balance_api;
