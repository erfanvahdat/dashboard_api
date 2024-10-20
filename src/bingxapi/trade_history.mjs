import axios from "axios";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";


// Load environment variables
dotenv.config();

const now = new Date().getTime();


// Subtract 5 days (in milliseconds)
const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000);

const starttime  =  fiveDaysAgo.getTime();
const  endtime  = now;
console.log()


// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;

const HOST = "open-api.bingx.com"
const API = {
    "uri": "/openApi/swap/v2/user/income",
    "method": "GET",
    "payload": {
        "startTime": starttime,
        "endTime": endtime,
        "limit": "1",
        // "timestamp": "1702731787011"
    },
    "protocol": "https"
}
async function main() {
    return await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET)
}
function getParameters(API, timestamp, urlEncode) {
    let parameters = ""
    for (const key in API.payload) {
        if (urlEncode) {
            parameters += key + "=" + encodeURIComponent(API.payload[key]) + "&"
        } else {
            parameters += key + "=" + API.payload[key] + "&"
        }
    }
    if (parameters) {
        parameters = parameters.substring(0, parameters.length - 1)
        parameters = parameters + "&timestamp=" + timestamp
    } else {
        parameters = "timestamp=" + timestamp
    }
    return parameters
}

async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET) {
    const timestamp = new Date().getTime()
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET))
    const url = protocol+"://"+host+path+"?"+getParameters(API, timestamp, true)+"&signature="+sign
    console.log("protocol:", protocol)
    console.log("method:", method)
    console.log("host:", host)
    console.log("path:", path)
    console.log("parameters:", getParameters(API, timestamp))
    console.log("sign:", sign)
    console.log(method, url)
    const config = {
        method: method,
        url: url,
        headers: {
            'X-BX-APIKEY': API_KEY,
        },
        transformResponse: (resp) => {
            return resp;
        }
    };
    const resp = await axios(config);
    const responseObject = JSON.parse(resp.data);

    console.log(resp.status);
    console.log(responseObject)
    return responseObject.data;
    
}

// Function to run the API call and export the data
async function trade_history() {
    try {
        // Call the API with the provided params
        const response = await main();
        
        return response;
    } catch (error) {
        console.error("Error executing trade order:", error);
        return null;
    }
}

// Example usage: Call the function by passing the orderParams object
const data = await trade_history();

// console.log(Object.keys(data.data))
// console.log('data is here =>',Object.keys(data))


// export default trade_history;