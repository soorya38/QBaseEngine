require('dotenv').config();

const {Pool}=require("pg")

const pool=new Pool({
    user:process.env.db_user,
    host:process.env.db_host,
    database:process.env.db_name,
    password:process.env.db_password,
    port:process.env.db_port
});

pool.connect()
    .then(()=>console.log("db connected"))
    .catch((err)=>{
        console.log(err)
    })


module.exports=pool;