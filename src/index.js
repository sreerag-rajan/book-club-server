require("dotenv").config()
const express = require("express");
const cors = require("cors")
const dbConnect = require("./configs/db")
const app = express();

const authController = require("./controller/auth.controller")
const discussionGroupController = require("./controller/discussionGroup.controller")

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use("/auth", authController);
app.use("/groups", discussionGroupController)


app.listen(process.env.PORT||2345, async ()=>{
    try{
        dbConnect();
        console.log("DB Connected")       
    }
    catch(er){
        console.log(er)
    }
    console.log("listening on port 2345")
})
//https://book-club-server-hackathon.herokuapp.com/ <- deployed on