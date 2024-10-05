


import express from 'express';
import { query ,body,validationResult,matchedData} from 'express-validator'; 
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
  // syncDatabase; // Ensure the database connection
});

let data= [
  {id:1,name:'vahdi2'},
  {id:2,name:'vahdi1'},
  {id:3,name:'vahdi2'},
  {id:4,name:'vahdi4'},
]




const Middleware = (req,res,next)=>{
  const {
    params: {id}
  } = req;

  // console.log('here')
  const parseid = parseInt(id);
  if(isNaN(parseid)) return res.sendStatus(400);
  const userindex = data.findIndex((user)=> user.id == parseid);
  console.log(userindex)
  if(userindex === -1 ) return res.sendStatus(404);
  req.userindex =userindex;
  next();

};




app.get('/hello', async (req, res) => {
  res.render('first_view');
  // res.status(201).send({msg:"hello to the EXpress.js"})
  
  // res.send("hello to the world");


  // await syncAllModels; // Sync all models when the server starts
  // syncDatabase; // Ensure the database connection
});


app.post('/hello', async (req, res) => {
  // console.log(req.body);
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

// Get User ID
  app.get('/api/user/:id',(req,res)=>{
  console.log(req.params)

  const parseid=  parseInt(req.params.id)

  if (isNaN(parseid)){
    console.log('here')
   return res.sendStatus(400)};
  

  const  user_find = data.find((user)=> parseInt(user.id) === parseid);

  if (!user_find) return res.sendStatus(400);

    return  res.send({ data:user_find });
  
})


const Middleware_2 = (req,res,next)=>{

  
  console.log(`${req.method} - ${req.url}`)
  next();
}

app.use(Middleware_2)
// 
app.put('/api/change_object/:id',
  [
    body("name")
      .isString().withMessage('Username must be string')
      .isLength({ min: 3, max: 10 }).withMessage('Username must be at least 3 characters and max of 10 characters'),
    body("display_name")
      .isString().withMessage('display_name must be a string')
  ]
,Middleware,(req,res)=>{
  const {
    body,
    userindex,
    
  } = req;

  const result = validationResult(req);
  console.log(result);

  const data_sample = matchedData(req);


  console.log(data_sample)
  if(!result.isEmpty()){
    return res.status(404).send({error: result.array()})
  };

  data[userindex]= {id : data[userindex].id , ...data[userindex]  , ...data_sample }
  return res.sendStatus(200);

  

})
// Use the routers
// app.use('/api', router); // Your main router




// Catch-all route for invalid URLs
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry, this is an invalid URL.',
  });
});

export default app;
