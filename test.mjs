


// npm install crypto-js -s 
// npm install axios -s 
import CryptoJS from "crypto-js";
import axios from "axios";

const get_time = Date.now()
console.log(get_time)

// const API_KEY = "TtsnymqBhk7WtEBgXhEbj9lRnsxKJjDo8ELyZmBrnc3L487Glj2ikQTM5jxC34m8GvHUMjLRwftfx8ZBglUbg"
// const API_SECRET = "tIBOTy2G7Rf7dekFuW9KFNDhg8WdywIuAPoRIWNZny72tRrgR8tOOTrhirleYuwTn6YvAJO1SwrGppFxOVDA"
// const HOST = "open-api.bingx.com"
// const API = {
//     "uri": "/openApi/swap/v2/user/positions",
//     "method": "GET",
//     "payload": {
//         "recvWindow": "0",
//         "symbol": "BNB-USDT",
//         "timestamp": "1702731661854"
//     },
//     "protocol": "https"
// }
// async function main() {
//     await bingXOpenApiTest(API.protocol, HOST, API.uri, API.method, API_KEY, API_SECRET)
// }
// function getParameters(API, timestamp, urlEncode) {
//     let parameters = ""
//     for (const key in API.payload) {
//         if (urlEncode) {
//             parameters += key + "=" + encodeURIComponent(API.payload[key]) + "&"
//         } else {
//             parameters += key + "=" + API.payload[key] + "&"
//         }
//     }
//     if (parameters) {
//         parameters = parameters.substring(0, parameters.length - 1)
//         parameters = parameters + "&timestamp=" + timestamp
//     } else {
//         parameters = "timestamp=" + timestamp
//     }
//     return parameters
// }

// main().catch(console.err);
// async function bingXOpenApiTest(protocol, host, path, method, API_KEY, API_SECRET) {
//     const timestamp = new Date().getTime()
//     const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(getParameters(API, timestamp), API_SECRET))
//     const url = protocol+"://"+host+path+"?"+getParameters(API, timestamp, true)+"&signature="+sign
//     console.log("protocol:", protocol)
//     console.log("method:", method)
//     console.log("host:", host)
//     console.log("path:", path)
//     console.log("parameters:", getParameters(API, timestamp))
//     console.log("sign:", sign)
//     console.log(method, url)
//     const config = {
//         method: method,
//         url: url,
//         headers: {
//             'X-BX-APIKEY': API_KEY,
//         },
//         transformResponse: (resp) => {
//             !!!!!!!very important
//             Notice:in nodeJS when you converts original resp(string) to json, order id is a big-int in some response
//             it may have big-int issue, will be transformed automatically
//             for example:  order id: 172998235239792314304 -be transformed automatically to-->172998235239792314300
//             if you find something wrong with order id like 'order not exist' or found the order id suffix with 00 or more 0, chould be the reason 
//             then can print the original response like below to check the origianl order id 
//             console.log(resp); 
//             return resp;
//         }
//     };
//     const resp = await axios(config);
//     console.log(resp.status);
//     console.log(resp.data);
//     !!!!!!!very important
//     if there is a Big int ,can transfer it like this below:
//     let jsonString = '{"longInt":1807651653281644544}';
//     console.log("original data:",jsonString)
//     let obj = JSON.parse(jsonString);
//     console.log("JSON.parse:",obj)
//     let longInt = BigInt(obj.longInt);
//     console.log("to longInt:",longInt.toString())
// }