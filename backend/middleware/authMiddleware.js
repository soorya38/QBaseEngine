const jwt=require("jsonwebtoken")
require('dotenv').config();

const auth=(req,res,next)=>{
    const authheader=req.header("Authorization")

    if(!authheader){
        return res.status(401).send("Token missing");
    }

    const token=authheader.split(" ")[1]

    if(!token){
        return res.status(401).send("invalid token")
    }

    try{
        const decoded=jwt.verify(token,process.env.secret_key)
        req.user=decoded;
        next()
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
}

module.exports=auth;