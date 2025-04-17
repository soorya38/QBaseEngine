const express=require("express")
const router=express.Router()
const pool=require("../config/db")
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
const auth = require("../middleware/authMiddleware");  //to verify jwt token(withj secret key)
require('dotenv').config()


router.post('/signup',async(req,res)=>{
    const {username,password,role}=req.body;
    const check=await pool.query('select * from users where username=$1',[username])
    console.log(check.rows)
    if(check.rowCount==1){
        res.status(400).send("user already exists")
    }else{
        const hashedpassword=await bcrypt.hash(password,10)
        const save=await pool.query('insert into users values($1,$2,$3)',[username,hashedpassword,role])
        if(save){
            console.log(save.rowCount)
            res.status(200).json({status:"signup success",data:save.rows})
        }else{
            res.send("signup failed")
        }
    }
})

router.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=await pool.query('select * from users where username=$1',[username])
    if(user.rowCount==0){
        return res.status(400).send("invalid username")
    }

    const passwordmatch=await bcrypt.compare(password,user.rows[0].password)

    if(!passwordmatch){
       return res.status(400).send("password mismatch")
    }

    const checkrole=user.rows[0].role===req.body.role

    if(!checkrole){
        return res.status(400).send("role mismatch")
    }
    

    const token=jwt.sign({username:user.rows[0].username,role:user.rows[0].role},process.env.secret_key,{expiresIn:"1h"})

    console.log("token "+token)

    res.status(200).json({ token, user: {username: user.rows[0].username } })
})

router.get('/profile',auth,async(req,res)=>{
    const userdata=await pool.query("select * from users where username=$1",[req.body.username])
    res.status(200).json({data:userdata.rows})
})

module.exports=router