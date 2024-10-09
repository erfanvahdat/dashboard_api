


import axios from "axios";
import dotenv from 'dotenv'; 
import CryptoJS from "crypto-js";


// Load environment variables
dotenv.config(); 


const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;
const HOST = "open-api.bingx.com"
const API = {
    "uri": "/openApi/swap/v2/trade/openOrder",
    "method": "GET",
    "payload": {
        "orderId": "1736012449498123456",

        "symbol": "DOT-USDT",
    },
    "protocol": "https"
}
async function main() {
    await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET)
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

main().catch(console.err);
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
            
            console.log(resp); 
            return resp;
        }
    };
    const resp = await axios(config);
    console.log(resp.status);
    console.log(resp.data);
    
    let jsonString = '{"longInt":1807651653281644544}';
    console.log("original data:",jsonString)
    let obj = JSON.parse(jsonString);
    console.log("JSON.parse:",obj)
    let longInt = BigInt(obj.longInt);
    console.log("to longInt:",longInt.toString())
}