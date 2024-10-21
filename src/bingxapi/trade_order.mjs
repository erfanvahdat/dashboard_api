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

async function main(orderParams) {
    const { symbol, type, risk, limitprice, slprice, tpprice, market } = orderParams;

    // Check for missing required fields

    if (!symbol || !type || !risk || !limitprice || !slprice || !tpprice || !market) {
        console.error('Missing required parameters in orderParams');
        // return { error: 'Missing required parameters', status: 400 };
        console.log('we are here on error')
        throw new Error("Missing required parameters")
    }


    const typeval = type.toString().toUpperCase();

    let side = null;
    let positionside = null;
    let marketval = market.toString().toUpperCase();

    if (marketval == "TRIGGER") {
        marketval = "TRIGGER_MARKET";
    } else if (marketval == "MARKET") {
        marketval = "MARKET";
    } else {
        console.error('Invalid market value');
        return { error: 'Invalid market value', status: 400 };
    }

    if (typeval === 'LONG') {
        positionside = "LONG";
        side = "BUY";
    } else if (typeval === 'SHORT') {
        positionside = "SHORT";
        side = "SELL";
    } else {
        console.error('Invalid type value');
        return { error: 'Invalid type value', status: 400 };
    }

    const symbolval = symbol;
    const riskval = parseFloat(risk);
    const limitPriceval = parseFloat(limitprice);
    const slPriceval = parseFloat(slprice);
    const tpPriceval = parseFloat(tpprice);
    const val = 22;

    const diff = Math.abs((limitPriceval - slPriceval) / slPriceval);
    const marginLimit = riskval;
    const riskPercent = 50;

    const res = (val * marginLimit) / 100;
    const diffPercent = diff * 100;
    const leverage = riskPercent / diffPercent;
    const size = (res / limitPriceval) * leverage;

    // Call switch_leverage
    const LV = await switch_leverage(symbol, parseInt(leverage));

    const HOST = "open-api.bingx.com";

    const API = {
        uri: "/openApi/swap/v2/trade/order",
        method: "POST",
        payload: {
            symbol: symbolval,
            side: side,
            positionSide: "BOTH",
            type: marketval,
            quantity: size,
            stopPrice: limitPriceval,
            price: limitPriceval,
            takeProfit: `{\"type\": \"TAKE_PROFIT_MARKET\", \"stopPrice\": ${tpPriceval},\"price\": ${tpPriceval},\"workingType\":\"MARK_PRICE\"}`,
            stopLoss: `{\"type\": \"STOP_MARKET\", \"stopPrice\": ${slPriceval},\"price\": ${slPriceval},\"workingType\":\"MARK_PRICE\"}`,
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

        // const data = resp.data;

        return await resp;

        // console.log("Response status:", resp.status);
    } catch (error) {
        console.error("Error during API request:", error);
    }
}

// Function to run the API call and export the data
async function trade_order(orderParams) {
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
// const data = await trade_order(orderParams);

export default trade_order;
