


import express from 'express';
import { userSchema } from '../utils/userschema.mjs';
// import  passport  from 'passport';
// import '../strategies/local_stategies.mjs';

import { hashpassword,comparepassword } from '../utils/hash.mjs';

import User from '../mongoose/schemas/userschemas.mjs' 
import Balance from '../mongoose/schemas/Balanceschemas.mjs';



import crypto_list_api from '../bingxapi/crypto_list_api.mjs';
import Crypto_list from '../mongoose/schemas/cryptolistschemas.mjs';

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

// const Middleware_2 = (req,res,next)=>{
//   console.log(`${req.method} - ${req.url}`)
//   next();
// }

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
      const exist_user = await User.findOne({ username: req.body.username });
      
      if (exist_user) {
          
          // Do something if user exists
          return res.status(200).send({'msg':"user does exist .Try another unique username and password."});  
      } else {
          console.log('User does not exist, trying to save into the database...');

          // Create a new user object (assuming you have user data in req.body)
          const newUser = new User(req.body);
          // Save the new user to the database
          const saveUser = await newUser.save();
          
          return res.status(201).send(`msg":"Use with username: ${newUser.username} and id: ${newUser._id}  is saved into DB `);  
      }
  } catch (err) {
      console.error('Error while finding the user:', err);
      return res.status(400).send({'msg':"something goes wrong! "});
  }
  
      });


router.get("/get_balance", (req,res)=>{
  try{

      return res.status(200).send({'msg':'msg',"data":balance_api})

  }catch(err){
    console.log(err);
  }

});



async function getBalanceHandler(req, res) {
  // Simulating some balance data
  const response = balance_api ;

  return response;
}



router.get("/get_BA/",(req,res)=>{
  try{

    // const response = axios.get('http://localhost:3003/api/get_balance');

    
    

    
      return res.send({"data":balance_api.balance})
    

  }catch(err){
    console.log(err);
    return res.sendStatus(400)
  }

});

router.post('/balance',(req,res)=>{

    try{
      const {body} = req;

      const balanceData =  balance_api; 
    
      const newBalance = new Balance({
        userId: balanceData.userId,
        asset: balanceData.asset,
        balance: balanceData.balance,
        equity: balanceData.equity,
        
    });

      // Check if all of body is healthy
      if (!newBalance) throw Error(err);

      const saveBalance = newBalance.save(); 
      return res.status(201).send({msg: `balance_meta_data is saved successfully`,  data: newBalance  });
    }catch(err){
      console.log('something goes wrong...')
      return res.sendStatus(400);
    }
  
    
  });


  
router.post('/crypto_list',(req,res)=>{

  try{
    const {body} = req;

  
        

    crypto_list_api.forEach(element => {

          // console.log(element)


      const newcrpyot_list = new Crypto_list({
        symbol: element , 
    });
      
        newcrpyot_list.save(); 
    });


    // Check if all of body is healthy
    // if (!newcrpyot_list) throw Error(err);

    
    return res.status(201).send({msg: `crypto_list is saved successfully`,    });
  }catch(err){
    console.log('something goes wrong... ',err)
    return res.sendStatus(400);
  }

  
});



router.get('/crypto_list', async (req, res) => {
  try {
      // Fetch all documents from the Crypto_list collection
      const cryptoData = await Crypto_list.find(); 
      res.status(200).send(cryptoData); // Send the data as a JSON response
  } catch (err) {
      console.error('Error fetching crypto list:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// router.use(Middleware_2)


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
