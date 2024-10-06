// import express from 'express';
// import { Balance } from '../database/models/Balance.mjs'; // Adjust the import based on your models structure

// const router = express.Router();

// /**
//  * @swagger
//  * /balance:
//  *   post:
//  *     summary: Create a new balance entry
//  *     description: Creates a new balance entry in the database.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               balanceData:
//  *                 type: number
//  *                 example: 1000
//  *     responses:
//  *       201:
//  *         description: Balance entry created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Balance entry created successfully
//  *                 data:
//  *                   type: object
//  *       500:
//  *         description: Failed to create balance
//  */

// router.post('/balance', async (req, res) => {
//   try {
//     const { balanceData } = req.body;
//     const newBalance = await Balance.create({ balanceData });
//     res.status(201).json({
//       message: 'Balance entry created successfully',
//       data: newBalance,
//     });
//   } catch (error) {
//     console.error('Error creating balance:', error);
//     res.status(500).json({ error: 'Failed to create balance' });
//   }
// });

// /**
//  * @swagger
//  * /balance:
//  *   get:
//  *     summary: Get the latest balance entry
//  *     description: Retrieves the latest balance entry from the database.
//  *     responses:
//  *       200:
//  *         description: Latest balance entry retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Latest balance entry
//  *                 data:
//  *                   type: object
//  *       404:
//  *         description: No balance data found
//  *       500:
//  *         description: Failed to fetch balance
//  */
// router.get('/balance', async (req, res) => {
//   try {
//     const latestBalance = await Balance.findOne({
//       order: [['timestamp', 'DESC']],
//     });

//     if (latestBalance) {
//       res.status(200).json({
//         message: 'Latest balance entry',
//         data: latestBalance,
//       });
//     } else {
//       res.status(404).json({ message: 'No balance data found' });
//     }
//   } catch (error) {
//     console.error('Error fetching balance:', error);
//     res.status(500).json({ error: 'Failed to fetch balance' });
//   }
// });

// export default router;
