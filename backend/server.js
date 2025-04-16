const express=require('express')
const pool=require("./config/db");
const user=require("./models/user")
const userRouter=require("./routes/userroute")
const app=express()

app.use(express.json());

app.use("/api",userRouter);

app.get("/home",(req,res)=>{
    res.send("hello test")
})

app.listen(3000,()=>{
    console.log("server running on 3000")
})