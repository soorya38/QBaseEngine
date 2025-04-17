const express=require("express")
const router=express.Router()
// const pool=require("../config/db")
const prisma=require("../config/db")
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
const auth = require("../middleware/authMiddleware");  //to verify jwt token(withj secret key)
require('dotenv').config()


router.post('/signup',async(req,res)=>{
    const {username,password,role}=req.body;

    const check=await prisma.users.findUnique({
        where:{
            username:username
        }
    })

    console.log(check)

    if(check){
        res.status(400).send("user already exists")
    }else{
        const hashedpassword=await bcrypt.hash(password,10)

        const save=await prisma.users.create({
            data:{
                username:username,
                password:hashedpassword,
                role:role
            }
        })

        if(save){
            console.log(save)
            res.status(200).json({status:"signup success",data:save})
        }else{
            res.send("signup failed")
        }
    }
})

router.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=await prisma.users.findUnique({
        where:{
            username:username
        }
    })
    if(!user){
        return res.status(400).send("invalid username")
    }

    const passwordmatch=await bcrypt.compare(password,user.password)

    if(!passwordmatch){
       return res.status(400).send("password mismatch")
    }

    const checkrole=user.role===req.body.role

    if(!checkrole){
        return res.status(400).send("role mismatch")
    }
    

    const token=jwt.sign({username:user.username,role:user.role},process.env.secret_key,{expiresIn:"1h"})

    console.log("token "+token)

    res.status(200).json({ token, user: {username: user.username } })
})

router.get('/profile',auth,async(req,res)=>{
    const userdata=await prisma.users.findUnique({
        where:{
            username:req.body.username
        }
    })
    res.status(200).json({data:userdata.rows})
})

module.exports=router