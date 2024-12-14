

import app from './main.mjs'; // Import the Express app from main.js
import chalk from 'chalk'; // Optional: Use chalk for colored console outputs
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config({ path: '../.env' });

// Start the server
async function run_server() {
    const port = process.env.PORT_ID_1;


    app.listen(port, () => {
        console.log(chalk.green(`Server is running on port ${port}`));
    });


    // setInterval(async () => {
    
    

    // }, 1000);
    

}


run_server();



