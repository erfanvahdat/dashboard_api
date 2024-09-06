

import app from './main.mjs';
import chalk from 'chalk';


async function run_server() {
    const port = process.env.PORT || 3001 ;

    app.listen(3001, () => {
        console.log('Server is running on port 3001');
            })
}


run_server();
