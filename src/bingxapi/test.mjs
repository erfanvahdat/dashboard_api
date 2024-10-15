


import { crpyto_list } from "./crypto_list_api.mjs";
import trade_order from "./trade_order.mjs";

import all_positon_orders from "./all_open_positions.mjs";
import all_pending_orders from "./all_pending_orders.mjs";


import close_pending_orders from "./close_pending_orders.mjs";
import close_position_orders from "./close_open_positions.mjs";

import all_orders from "./all_orders.mjs";


const orderParams = {
    symbol: 'SAND-USDT',
    type: 'LONG',
    risk: 1,
    limitprice: 0.263050415407308,
    slprice: 0.258852479193110,
    tpprice: 0.270874926959671,
    market: "trigger"
};

// const data = await crpyto_list()
// const obj = await trade_order(orderParams)
// const obj = await all_pending_orders()
// const obj = await all_positon_orders()
const obj = await all_orders();
// const data = await close_pending_orders1844660245746831400)

console.log(obj)
// console.log(Object.keys(data))

// const data_filter = data.filter(item=> item.symbol === "GALA-USDT")
// console.log(data_filter[0].orderId)

