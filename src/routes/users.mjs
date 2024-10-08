


import express from 'express';
import { userSchema } from '../utils/userschema.mjs';
// import  passport  from 'passport';
// import '../strategies/local_stategies.mjs';

import { hashpassword,comparepassword } from '../utils/hash.mjs';

import User from '../mongoose/schemas/userschemas.mjs' 
import { query ,body,validationResult,matchedData, checkSchema} from 'express-validator'; 
const router = express.Router();


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

const Middleware_2 = (req,res,next)=>{
      
  console.log(`${req.method} - ${req.url}`)
  next();
}

// Get User ID
router.get('/user/:id',(req,res)=>{
    console.log(req.params)
  
    const parseid=  parseInt(req.params.id)
  
    if (isNaN(parseid)){
      console.log('here')
     return res.sendStatus(400)};
    
  
    const  user_find = data.find((user)=> parseInt(user.id) === parseid);
  
    if (!user_find) return res.sendStatus(400);
  
      return  res.send({ data:user_find });
    
  })
  
  router.post('/user/user/', async (req, res) => {
    try {
      const { body } = req;
      const data = matchedData(req);
  
      // Await the hashed password
      const hashed_password = await hashpassword(body.password); 
      body.password = hashed_password;
      
      console.log(hashed_password);  // Log the hashed password
  
      const newUser = new User(body);
  
      // Save the new user to the database
      const saveUser = await newUser.save(); 
  
      return res.status(201).send(saveUser);  // Send the saved user as the response
  
    } catch (err) {
      console.log(err);  // Log any errors that occur
      res.sendStatus(400);  // Send a 400 status code for any errors
    }
  });
  
router.use(Middleware_2)
  
router.put('/change_object/:id',
    checkSchema(userSchema),  // Use the schema for validation
    Middleware,
    (req, res) => {
      // Validation results
      const result = validationResult(req);
  
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() }); // Return validation errors if any
      }
  
      // Get only the validated data
      const data_sample = matchedData(req);
      console.log(data_sample);
  
      const { userindex } = req;
  
      // Assuming 'data' is your user array
      data[userindex] = { id: data[userindex].id, ...data[userindex], ...data_sample };
  
      return res.sendStatus(200);
    }
  );

const router_user = router;

export default router_user;
