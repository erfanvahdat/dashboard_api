


import { crpyto_list } from "./crypto_list_api.mjs";
import trade_order from "./trade_order.mjs";
// import all_open_orders from "./all_open_orders.mjs";
// import all_pending_orders from "./all_pending_orders.mjs";



const orderParams = {
            symbol: 'SAND-USDT',
            side: 'SELL',
            positionside: 'SHORT',
            risk: 1,
            limitprice: 0.248687757152951,
            slprice: 0.252574555996874,
            tpprice: 0.240628535790201,
        };

// const data = await crpyto_list()
const data = await  trade_order(orderParams)
// const data = await all_pending_orders()
// const data =await  all_open_orders()


console.log(data)

// const data_filter = data.filter(item=> item.symbol === "GALA-USDT")
// console.log(data_filter[0].orderId)

