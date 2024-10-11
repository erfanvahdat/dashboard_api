import express from 'express';
import {
  body,
  query,
  matchedData,
  checkSchema,
  validationResult,
} from 'express-validator';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';

import bingx_router from './routes/bingx.mjs';
import swaggerJsDoc from 'swagger-jsdoc';
import './strategies/local_stategies.mjs';
import swaggerUi from 'swagger-ui-express';
import router_user from './routes/users.mjs';
// import syncDatabase from '../database/db.mjs'; // Ensure database connection

const app = express();

mongoose
  .connect('mongodb+srv://db01:fc98TpYumNA7IyNh@cluster0.ugagn.mongodb.net/USER')
  .then(() => console.log('Connect to MongoDB'))
  .catch((err) => console.log(`Error: ${err}`));

// Middleware to parse JSON bodies
app.use(express.json());

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
  apis: ['../routes/*.mjs'], // Add path to the balance router
};

app.use(
  session({
    secret: 'your-',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
      secure: false, // For development, false; for production, set to true with HTTPS
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set view engine and views
app.set('view engine', 'pug');
app.set('views', '../views');

// Home route
app.get('/', async (req, res) => {
  // Uncomment if needed for session usage
  // console.log(req.session);
  // console.log(req.session.id);

  // req.session.visited = true;
  res.render('first_view');
  res.sendStatus(200);
});

app.post('/hello', async (req, res) => {
  const { body } = req;
  const newUser = {
    id: (parseInt(data[data.length - 1].id) + 1).toString(),
    ...body,
  };
  data.push(newUser);
  return res.status(201).send(newUser);
});

// Get All USERS
app.get('/api/get_all_user', (req, res) => {
  res.status(200).json({
    data_: data,
  });
});


//  current inprogress..
// Authenticate using Passport
app.post('/auth', passport.authenticate('local'), (req, res) => {
  return res.sendStatus(200);
});

// Auth Status Check  
app.get('/auth/status', (req, res) => {

  console.log('Checking authentication status');
  console.log(req.user);
  console.log(req.session);
  console.log(req.session._id);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

// Use user router
// app.use('/api', router_user);
app.use('/api', bingx_router)

// Catch-all route for invalid URLs
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry, this is an invalid URL.',
  });
});

export default app;
