const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    bookName: {type:String, required:true},
    description:{type:String, required:true},
    memberLimit : {type:Number, required:true},
    members: [{type:mongoose.Schema.Types.ObjectId, ref:"user"}],
    createdBy : {type:mongoose.Schema.Types.ObjectId, ref: "user", required:true},
},{
    versionKey:false,
    timestamps:true
})

module.exports = mongoose.model("group", groupSchema);