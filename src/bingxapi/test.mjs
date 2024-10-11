


import { crpyto_list } from "./crypto_list_api.mjs";
import trade_order from "./trade_order.mjs";
// import all_open_orders from "./all_open_orders.mjs";
// import all_pending_orders from "./all_pending_orders.mjs";



const orderParams = {
            symbol: 'SAND-USDT',
            // side: 'BUY',
            // positionside: 'LONG',

            type : 'LONG',
            risk: 1,
            limitprice: 0.251489839221986,
            slprice: 0.248029145119103,
            tpprice: 0.253995569309945,
            market :  "trigger"
        };

// const data = await crpyto_list()
const data = await  trade_order(orderParams)
// const data = await all_pending_orders()
// const data =await  all_open_orders()


console.log(data)

// const data_filter = data.filter(item=> item.symbol === "GALA-USDT")
// console.log(data_filter[0].orderId)

