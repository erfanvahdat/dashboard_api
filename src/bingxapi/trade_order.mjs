import axios from "axios";
import dotenv from 'dotenv'; 
import CryptoJS from "crypto-js";
import switch_leverage from "./leverage_api.mjs";

// Load environment variables
dotenv.config(); 

// Set up API credentials and endpoint details
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.SECRET_KEY;

// open/buy LONG: side=BUY & positionSide=LONG
// close/sell LONG: side=SELL & positionSide=LONG
// open/sell SHORT: side=SELL & positionSide=SHORT
// close/buy SHORT: side=BUY & positionSide=SHORT

async function main(symbol, side, positionside, risk, limitprice, slprice, tpprice) {
    const symbolval = symbol;
    
    const riskval = parseFloat(risk);
    const limitPriceval = parseFloat(limitprice);
    const slPriceval = parseFloat(slprice);
    const tpPriceval = parseFloat(tpprice);
    const val = 22;

    if (positionside == "LONG") {
        side = "BUY";
    }
    if (positionside == "SHORT") {
        side = "SELL";
    }
    
    const diff = Math.abs((limitPriceval - slPriceval) / slPriceval);
    const marginLimit = riskval;
    const riskPercent = 50;

    const res = (val * marginLimit) / 100;
    const diffPercent = diff * 100;
    const leverage = riskPercent / diffPercent;
    const size = (res / limitPriceval) * leverage;
    
    const LV = switch_leverage(symbol, parseInt(leverage));
    // co/sznsole.log(`we are here with leverage of : ${leverage}`);


    const HOST = "open-api.bingx.com";

    const API = {
        "uri": "/openApi/swap/v2/trade/order",
        "method": "POST",
        "payload": {
            "symbol": symbolval,
            "side": side,
            "positionSide": 'BOTH',
            "type": "TRIGGER_LIMIT",
            // "type": "MARKET",
            "quantity": size,
            "stopPrice": limitPriceval,
            "price":limitPriceval
                // "takeProfit": `{\"type\": \"TAKE_PROFIT_MARKET\", \"stopPrice\": ${limitPriceval},\"price\": ${limitPriceval},\"workingType\":\"MARK_PRICE\"}`
        },
        "protocol": "https"
    };

    await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET, API);
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
        parameters = parameters + "&timestamp=" + timestamp;
    } else {
        parameters = "timestamp=" + timestamp;
    }
    return parameters;
}

async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET, API) {
    const timestamp = new Date().getTime();
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET));
    const url = `${protocol}://${host}${path}?${getParameters(API, timestamp, true)}&signature=${sign}`;
    console.log("protocol:", protocol);
    console.log("method:", method);
    console.log("host:", host);
    console.log("path:", path);
    console.log("parameters:", getParameters(API, timestamp));
    console.log("sign:", sign);
    console.log(method, url);
    
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
async function trade_order(orderParams) {
    try {
        // Destructure the object to get the parameters
        const { symbol, side, positionside, risk, limitprice, slprice, tpprice } = orderParams;

        // Example body (just for reference):
        // const orderParams = {
        //     symbol: 'GALA-USDT',
        //     side: 'BUY',
        //     positionside: 'LONG',
        //     risk: 1,
        //     limitprice: 0.020020901371653,
        //     slprice: 0.019585628083838,
        //     tpprice: 0.020514581675103,
        // };

        // Call the API with the destructured params
        const Tradeorder = await main(symbol, side, positionside, risk, limitprice, slprice, tpprice);
        return Tradeorder;  
    } catch (error) {
        console.error("Error exporting balance data:", error);
        return null;  
    }
}

// Call the function by passing the entire object
// const data = await trade_order(orderParams);

export default trade_order; 
