


import app from './main.mjs'; // Import the Express app from main.js
import chalk from 'chalk'; // Optional: Use chalk for colored console outputs
import dotenv from 'dotenv'; 

dotenv.config({ path: '../.env' }); 

async function run_server() {
    const port = process.env.PORT ;
    
    app.listen(port, () => {
        console.log(chalk.green(`Server is running on port ${port}`));
    });
    
}

run_server();
