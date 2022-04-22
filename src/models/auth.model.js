const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name:{type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required:true}
},{
    versionKey:false,
    timestamps:true
})

userSchema.pre("save", function(next){
    if(!this.isModified("password")) return next();

    var hash = bcryptjs.hashSync(this.password, 8);
    this.password = hash;
    return next();
})

module.exports = mongoose.model("user", userSchema)