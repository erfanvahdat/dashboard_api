
import axios from "axios";
import dotenv from 'dotenv'; 
import CryptoJS from "crypto-js";


// Load environment variables
dotenv.config(); 


const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;



const HOST = "open-api.bingx.com"
const API = {
    "uri": "/openApi/swap/v2/quote/contracts",
    "method": "GET",
    "payload": {},
    "protocol": "https"
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
            
            // console.log(resp); 
            return resp;
        }
    };
    const resp = await axios(config);
    console.log(resp.status);
    return resp    
}

export async function crpyto_list() {
    try {
        const crpyto_list =  await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET)

        const parsedData = JSON.parse(crpyto_list.data);
        const crpyto_list_filter = parsedData.data.filter(item =>item.symbol.includes('-USDT')).map(item=>item.symbol)

        return crpyto_list_filter;  
    } catch (error) {
        console.error("Error exporting balance data:", error);
        return null;  
    }
}


export default crpyto_list;