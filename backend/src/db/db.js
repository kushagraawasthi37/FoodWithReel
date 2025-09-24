const mongoose = require("mongoose")

function connectionDB(){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("MongoDD Connected Successfully")
    }).catch((err)=>{
        console.error("MongoDB Connection failed",err);
    })
}

module.exports= connectionDB;