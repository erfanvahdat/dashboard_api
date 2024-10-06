

import passport from 'passport';
import {Strategy} from 'passport-local';
import data from '../utils/data.mjs';
import { BingxPerpetualSwapPositionsEndpoint } from 'bingx-api';



passport.serializeUser((user,done)=>{

    console.log("Inside Serialize user");
    console.log(user)

    done(null,user.id)
})


passport.deserializeUser((id,done)=>{
    console.log("Decrealize")

    try{
        const findUser =data.find((user)=>user.id === id );
        if(!findUser) throw new Error("user Not found!")
        done(null ,findUser)
    }catch{
        done(err,null);
    }
}
)


export default  passport.use(
    new Strategy((username,password,done)=>{
        try{

            console.log(data)
            console.log(username)
            console.log(`username: ${username} - password :${password}`);
            
            const  user_find = data.find((user)=> user.username === username);


            if(!user_find)  throw new Error('User not found!');
            // if(user_find.password !== password) throw new Error('invalid Crendentials!') ;

            done(null,user_find)


        }catch(err){
            done(err,null)
        }

    })
)