const express=require("express")
const router=express.Router();
const pool=require("../config/db")

const users=require('../models/user')

router.get('/profile',async(req,res)=>{
    const userdata=await pool.query("select * from users");
    res.status(200).json({data:userdata.rows})
})

module.exports=router