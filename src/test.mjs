

import DexApiNodejs from 'dex-api-nodejs';

let apiInstance = new DexApiNodejs.AssetApi();
apiInstance.getTokenList().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});



// import axios from "axios";
// import crypto from "crypto"

// // Your API credentials
// const API_KEY = "455205E83F5A4ED38CD9B211867361B3";

// const API_SECRET = "3F353ABE7352CA0A8602D9ADFDE59F967B3AA00097CE1F5A";

// // API endpoint and base URL
// const BASE_URL = 'https://api.coinex.com/v2';
// const ENDPOINT = '/assets/spot/balance';


// async function getSpotBalance() {
//     try {
//         // Current timestamp in milliseconds
//         const timestamp = Date.now();

//         // Prepare the string for signing
//         const preparedStr = `GET${ENDPOINT}${timestamp}`;

//         // Generate the signature
//         const signature = crypto
//             .createHmac('sha256', API_SECRET)
//             .update(preparedStr)
//             .digest('hex')
//             .toLowerCase();

//         // Make the GET request
//         const response = await axios.get(`${BASE_URL}${ENDPOINT}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 signed_str: signature,
//                 access_id: API_KEY,
//                 // timestamp: timestamp,
//             },
//         });

//         console.log('Spot Balance:', response.data);
//     } catch (error) {
//         console.error('Error fetching spot balance:', error.response?.data || error.message);
//     }
// }

// getSpotBalance();
