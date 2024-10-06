


import express from 'express';
import { query ,body,validationResult,matchedData, checkSchema} from 'express-validator'; 
import router from './routes/router.mjs'
import router_user from './routes/users.mjs';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import syncDatabase from '../database/db.mjs'; // Ensure database connection
import session from 'express-session';
import  passport  from 'passport';
import './strategies/local_stategies.mjs';
import mongoose from 'mongoose';

const app = express();


mongoose
  .connect("mongoose://express_tut")  
  .then(()=>console.log('Connect to MongoDB'))
  .catch((err)=>console.log(`Eror :${err}`))

  
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
  apis: ['../routes/*.mjs' ], // Add path to the balance router
};

app.use(session({
  secret: 'your-secret-key',
  resave: false,  
  saveUninitialized: false, 
  cookie: {
    maxAge: 60000 * 60, 
    secure: false,  
    httpOnly: true, 
  }
}));

app.use(passport.initialize());
app.use(passport.session());


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set view engine and views
app.set('view engine', 'pug');
app.set('views', '../views');


// app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', async (req, res) => {
  //  console.log(req.session);
  //  console.log(req.session.id);
   
  //  req.session.visited= true;
  res.render('first_view');
  res.sendstatus(200);

});


app.post('/hello', async (req, res) => {
  const  {body}= req;
  const newUser = {id: (parseInt(data[data.length -1 ].id) +1 ).toString()  , ...body };
  data.push(newUser)
  return res.status(201).send(newUser)
  // return res.sendStatus()

});


// Get All USERS
app.get('/api/get_all_user',(req,res)=>{

    res.status(200).json({
      data_:data
    });
  })



app.post('/auth',passport.authenticate('local'),(req,res)=>{
  return res.sendStatus(200);
  })
  

app.get('/auth/status',(req,res)=>{
  console.log('inside getting status of Auth');
  console.log(req.user  );
  console.log(req.session)
  return req.user ? res.send(req.user): res.sendStatus(401)
  
  })



app.use('/api',router_user);

// Catch-all route for invalid URLs
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry, this is an invalid URL.',
  });
});

export default app;
