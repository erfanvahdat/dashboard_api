

// import { DataTypes } from 'sequelize';
import { sequelize } from '../db.mjs';



// // Define the Balance model
// const Balance = sequelize.define('Balance', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     timestamp: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//     },
//     balanceData: {
//         type: DataTypes.JSONB, // Storing balance data in JSON format
//         allowNull: false,
//     },
// }, {
//     tableName: 'balance',   // Table name in the database
//     timestamps: false,      // Disable Sequelize's automatic timestamp fields (createdAt, updatedAt)
// });

// // Sync model with database (create the table if it doesn't exist)
// (async () => {
//     await Balance.sync();
//     console.log('Balance table has been synced.');
// })();

// export default Balance;
