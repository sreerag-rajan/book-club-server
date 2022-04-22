const express = require("express");

const User = require("../models/auth.model");
const bcryptjs = require("bcryptjs")


const router = express.Router()

router.post("/register", async (req,res)=>{
    try{
        let user = await User.findOne({email:req.body.email})
        if(user){
            return res.status(404).send("User already exists");
        }
        user = await User.create(req.body)
        return res.status(201).send(user);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

router.post("/login", async (req,res)=>{
    try{
        let user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).send("email not found");
        }
        
        const match = bcryptjs.compareSync(req.body.password, user.password);
        if(!match){
            return res.status(404).send("passowrd not matched");
        }

        return res.status(201).send({
            name: user.name,
            id: user._id,
            email: user.email
        });
        

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

router.get("/users", async (req,res)=>{
    try{
        let users = await User.find().lean().exec();
        return res.status(200).send(users)
    }
    catch(er){
        return res.status(500).send(er.message)
    }
})


module.exports = router;