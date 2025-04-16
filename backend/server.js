const express=require('express')
const app=express()


app.use("/home",(req,res)=>{
    res.send("hello test")
})

app.listen(3000,()=>{
    console.log("server running on 3000")
})