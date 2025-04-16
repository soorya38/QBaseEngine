const express=require("express")
const router=express.Router();
const pool=require("../config/db")
const bcrypt=require('bcryptjs')
const users=require('../models/user')


router.post('/signup',async(req,res)=>{
    const {username,password}=req.body;
    const check=await pool.query('select * from users where username=$1',[username]);
    console.log(check.rows)
    if(check.rowCount==1){
        res.status(400).send("user already exists");
    }else{
        const hashedpassword=await bcrypt.hash(password,10)
        const save=await pool.query('insert into users values($1,$2)',[username,hashedpassword])
        if(save){
            console.log(save.rowCount);
            res.status(200).send("signup success")
        }else{
            res.send("signup failed")
        }
    }
})
router.get('/profile',async(req,res)=>{
    const userdata=await pool.query("select * from users");
    res.status(200).json({data:userdata.rows})
})

module.exports=router