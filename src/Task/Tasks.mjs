import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define Pending_position_status
export async function Pending_position_status() {
    try {
        console.log('getting_pending_orders');
        const response_pending = await axios.get(process.env.VITE_ALL_PENDING_ORDER);
        const response_position = await axios.get(process.env.VITE_ALL_OPEN_POSITION);

        const pending_response = response_pending.data.data;
        const position_response = response_position.data.data;

        return { full_order: pending_response, open_position: position_response };
    } catch (error) {
        throw new Error(`Failed to fetch trades: ${error.message}`);
    }
}

// Define Merging_data
export function Merging_data(full_order) {
    const data = full_order;
    const consolidatedTrades = {};

    data.forEach(item => {
        const symbol = item.symbol;
        let ID = null;

        if (item.type === 'TRIGGER_MARKET') {
            ID = item.orderId;
        }

        if (!consolidatedTrades[symbol]) {
            consolidatedTrades[symbol] = {
                symbol: symbol,
                side: item.side,
                order_id_sl: null,
                order_id_tp: null,
                order_pending_id: ID,
                order_position_id: ID,
                type: item.type
            };
        }

        if (item.type === 'STOP_MARKET') {
            consolidatedTrades[symbol].order_id_sl = item.orderId.toString();
        }
        if (item.type === 'TAKE_PROFIT_MARKET') {
            consolidatedTrades[symbol].order_id_tp = item.orderId.toString();
        }

        consolidatedTrades[symbol].side = item.side;
        consolidatedTrades[symbol].time = item.time;
    });

    return Object.values(consolidatedTrades);
}
