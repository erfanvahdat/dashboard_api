

import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 


// Initialize the Sequelize instance
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: 'postgres',  // Specify the dialect you're using
  logging: false,       // Disable SQL query logging in the console (optional)
});

// Test the database connection
(async () => {
  try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
