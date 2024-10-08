import bcrypt from 'bcrypt';



export const hashpassword=  async (password)=>{
 
    const saltRounds =10;
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(saltRounds);
    return bcrypt.hash(password,salt);

}


export const comparepassword=async(plain,password)=>{
    bcrypt.compareSync(plain,password)

}
