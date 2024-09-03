

// Import pg-promise
import pgPromise from 'pg-promise';
import chalk from 'chalk';


// Initialize pg-promise
const pgp = pgPromise();

// Connection string
const connectionString = 'postgres://postgres:eadmin@localhost:5432/db01';

// Create a database instance
const db = pgp(connectionString);


(async () => {
  try {
    // Fetch all rows from the trade_history table
    const rows = await db.any('SELECT * FROM trade_history');
    console.log(chalk.blue('Trade History:', rows));

  } catch (error) {
    console.error('ERROR fetching trade history:', error.message || error);
  } finally {
    // Close the connection pool when done to prevent the process from hanging
    if (pgp) {
      pgp.end();
    }
  }
})();

