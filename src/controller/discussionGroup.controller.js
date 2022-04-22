const express = require("express");
const Group = require("../models/discussionGroup.model")

const router = express.Router();

router.post("", async (req,res)=>{
    try{
        let group = await Group.create(req.body)
        return res.status(201).send(group);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

//Route to get all meetings.
router.get("", async (req,res)=>{
    try{
        const groups = await Group.find().sort({createdAt:-1}).lean().exec()
        return res.status(200).send(groups)

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

//Route to get all meeting particular to a book
router.get("/book/:name", async (req,res)=>{
    try{
        const groups = await Group.find({bookName:req.params.name}).sort({createdAt:-1}).populate("members").populate().lean().exec()
        return res.status(200).send(groups);
    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

//ROute to get all meeting particular to a user
router.get("/user/:id", async (req,res)=>{
    try{
        const groups = await Group.find({members:req.params.id}).sort({createdAt:-1}).populate("members").populate("createdBy").lean().exec()
        return res.status(200).send(groups);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

//Route to get a particular meeting
router.get("/:id", async (req,res)=>{
    try{
        const group = await Group.findById(req.params.id).populate("members").populate("createdBy").lean().exec();
        return res.status(200).send(group);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

//Route to edit a meeting
router.patch("/:id", async (req,res)=>{
    try{
        const group = await Group.findByIdAndUpdate(req.params.id, req.body).lean().exec();
        return res.status(201).send(group);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})

//Route to delete a meeting
router.delete("/:id", async (req,res)=>{
    try{
        const group = await Group.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(204).send(group);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
})


router.post("/joinGroup/:groupid", async (req,res)=>{
    try{
        let group = await Group.findById(req.params.groupid).lean().exec();
        if(group.members.length>=group.memberLimit){
            return res.status(400).send("Group already full");
        }
        let found = group.members.filter((el)=>{
            if(el.toString()===req.body.userId){
                return el;
            }
        })
        if(found.length>0) return res.status(400).send("Already joined");

        group.members.push(req.body.userId);
        await Group.findByIdAndUpdate(req.params.groupid, group).lean().exec();
        return res.status(201).send(group);
    }
    catch(er){
        return res.status(500).send(er.message)
    }
})
router.post("/leaveGroup/:groupid", async (req,res)=>{
    try{
        let group = await Group.findById(req.params.groupid).lean().exec();
        group.members = group.members.filter((el)=>{
            if(el.toString()!==req.body.userId){
                return el;
            }
        })
        
        await Group.findByIdAndUpdate(req.params.groupid, group).lean().exec();
        return res.status(201).send(group);
    }
    catch(er){
        return res.status(500).send(er.message)
    }
})


module.exports = router