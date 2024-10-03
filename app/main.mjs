


import express from 'express';
import router from '../routes/router.mjs'; // Your main router

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import syncDatabase from '../database/db.mjs'; // Ensure database connection
// import syncAllModels from '../database/models/index.mjs'; // Sync all models

const app = express();

// Swagger Api
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation for your Express app',
      contact: {
        name: 'Developer',
      },
      servers: [
        {
          url: 'http://localhost:3003', // Adjust to your app's server URL
        },
      ],
    },
  },
  apis: ['../routes/*.mjs' ], // Add path to the balance router
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set view engine and views
app.set('view engine', 'pug');
app.set('views', '../views');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', async (req, res) => {
  res.render('first_view');
  // await syncAllModels; // Sync all models when the server starts
  syncDatabase; // Ensure the database connection
});

// Use the routers
app.use('/api', router); // Your main router
// app.use('/api', balanceRouter); // The new balance router




// Catch-all route for invalid URLs
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry, this is an invalid URL.',
  });
});

export default app;
