const mongoose = require("mongoose");
var conn = mongoose.Collection;
var UserSchema=new mongoose.Schema({
    email: {
        type:String,
    },
    fullName: {
        type:String,
    },
    aadharno: {
        type:String,
    },
    phoneno: {
        type:String
    },
    password: {
        type:String
    }
},
{ timestamps: true }
);

var User=mongoose.model('User',UserSchema);
module.exports=User;