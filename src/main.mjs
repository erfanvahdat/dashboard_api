import express from 'express';
import dotenv from 'dotenv';
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
import chalk from 'chalk';
import cors from 'cors';

import bingx_router from './routes/bingx.mjs';
import swaggerJsDoc from 'swagger-jsdoc';
import './strategies/local_stategies.mjs';
import swaggerUi from 'swagger-ui-express';
// import router_user from './routes/users.mjs';-
import Balance from './bingxapi/Balance.mjs';

import multer from "multer";
import path from "path";

// Imporintg DB models
import Balance_model from './mongoose/schemas/Balanceschemas.mjs';
import journal_model from './mongoose/schemas/Journal.mjs';
const app = express();

// importing router in .env file
dotenv.config()

mongoose
  .connect(process.env.CONNECT_DB)
  .then(() => console.log('Connect to MongoDB'))
  .catch((err) => console.log(`Error: ${err}`));

// Middleware to parse JSON bodies
app.use(express.json());


// Enable CORS
app.use(cors({
  origin: 'http://localhost:5170', // Allow your Vue.js frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-origin'], // Headers you allow
  credentials: true // If you are using cookies or sessions
}));


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
          url: 'http://localhost:3006', // Adjust to your app's server URL
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
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set view engine and views
app.set('view engine', 'pug');
app.set('views', '../views');


let timer =  Date.now()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), "uploads")); // Save files to ./uploads folder
  },
  filename: (req, file, cb) => {
      // Extract the file extension
      const fileExtension = path.extname(file.originalname); // Includes the dot (e.g., ".png")
      // Set the filename to Date.now() + original extension
      cb(null, `${ timer }${fileExtension}`);
  },
});
const upload = multer({ storage });


// Home route
app.get('/', async (req, res) => {
  // Uncomment if needed for session usage
  res.render('first_view');
  res.sendStatus(200);
});

// ----------------------------------------API_upload----------------------------------
app.post("/api/upload", upload.array("demo[]"), async (req, res) => {
  try {
      // if (!req.files || req.files.length === 0) {
      //     return res.status(400).json({ message: "No files uploaded." });
      // }

      const { symbol, type, result, time, description, market } = req.body;

      // Ensure all required fields are present
      if (!symbol || !type || !result || !time || !description || !market) {
          return res.status(200).json({ message: "All fields are required" });
      }

      // Save to the database
      const newJournalEntry = new journal_model({
          symbol,
          type,
          result,
          time, 
          description,
          market,
          image: timer , // Save file metadata in the database
      });

      await newJournalEntry.save();

      res.status(201).json({
          message: "Files uploaded and journal entry created successfully.",
          journalEntry: newJournalEntry,
      });
  } catch (error) {
      console.error("Error uploading files or creating journal entry:", error);
      res.status(500).json({ message: "Error creating journal entry." });
  }
});
// ----------------------------------------------------------------------------
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




// ----------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------ Journal Querry ----------------------------------------------------------------------------
app.post("/Journal", async (req, res) => {
  try {
    const { symbol, type, result, time, description, market,image } = req.body;

    if (!symbol || !type || !result || !time || !description || !market) {
      return res.status(200).json({ message: "All fields are required" });
    }

    const newJournal = new journal_model({
      symbol,
      type,
      result,
      time,
      description,
      market,
      image,
    });

    await newJournal.save();

    console.log(chalk.green("Journal entry created successfully"));
    return res.status(201).json(newJournal);
  } catch (err) {
    console.error(chalk.red("Error creating journal entry:"), err);
    return res.status(500).json({ message: "Error creating journal entry" });
  }
});





// ----------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------ Balance accoutn Querry ----------------------------------------------------------------------------
// Balance of current API Acccount
app.get("/get_balance",  async (req, res) => {
  try {
    
    const balance = await Balance() ;

    if( !balance || balance == null){
      return res.send('balance endpoint is borken')
    }
    // Filter the data which contain the USDT values
    const balance_api = balance.data.find(item => item.asset === 'USDT')
    
    return res.send({msg:'Balance_user' , data : balance_api })
    
  } catch (err) {
    console.log(err);
  }

});

app.post("/save_balance_db",  async (req, res) => {
  try {
    
    const { body } = req;

    // const balance = await Balance() ;

    const db_querry =  await Balance_model.find()
    
    if( !db_querry || db_querry == null){
      return res.send('Querry to balace Table does not reach')
    }
  
    if( await Balance_model.findOne({ balance : body.balance }) ||
       await Balance_model.findOne({ equity : body.equity }) ){
      return res.send({msg: "data is already exist in the db" })

    }
    
    const new_att  = new Balance_model({
      "balance": body.balance,
      "equity": body.equity,
      "asset": body.asset
    })

    console.log(chalk.green('Updating Balance is Done'))
    await new_att.save()

    return res.status(200).send('Updating Balance is Done')
  } catch (err) {
    console.log(err);
  }

});


// Balance of current API Acccount
app.get("/get_balance_db",  async (req, res) => {
  try {
    
    const balance = await Balance_model.find() ;

    if( !balance || balance == null){
      return res.send('balance endpoint is borken')
    }
  
    return res.send({msg:'Balance_user_DB' , data : balance })
    
  } catch (err) {
    console.log(err);
  }

});


// Catch-all route for invalid URLs
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry, this is an invalid URL.',
  });
});

export default app;
