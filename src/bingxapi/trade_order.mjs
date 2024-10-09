



import axios from "axios";
import dotenv from 'dotenv'; 
import CryptoJS from "crypto-js";


// Load environment variables
dotenv.config(); 

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;

// open/buy LONG: side=BUY & positionSide=LONG
// close/sell LONG: side=SELL & positionSide=LONG
// open/sell SHORT: side=SELL & positionSide=SHORT
// close/buy SHORT: side=BUY & positionSide=SHORT


async function main(symbol,side,positionside,type='Market',risk,limitprice,slprice,tpprice) {



    
    
    
    const risk= parseFloat(risk)
    const limitPrice = parseFloat(limitprice)
    const slPrice=parseFloat(slprice)
    const tpPrice=parseFloat(tpprice)
    const bal=parseFloat(22)



    if (positionside == "LONG"){
        side="BUY"}
    if (positionside=="SHORT"){
    side="SELL"}
    

        diff=np.abs((limitPrice-slPrice)/slPrice)
    marginLimit=int(risk)
    riskPercent=50
    

    const HOST = "open-api.bingx.com"
    const API = {
        "uri": "/openApi/swap/v2/trade/order",
        "method": "POST",
        "payload": {
            "symbol":symbol ,
            "side": side,
            "positionSide": positionside,
            "type": "MARKET",
            "quantity": 5,
            "takeProfit": "{\"type\": \"TAKE_PROFIT_MARKET\", \"stopPrice\": 31968.0,\"price\": 31968.0,\"workingType\":\"MARK_PRICE\"}"
        },
        "protocol": "https"
    }

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
