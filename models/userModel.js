const  mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const userSchema = mongoose.Schema({
    username: {
        type : String,
        require : [true,"Please Enter Name"]
    },
    email: {
        type : String,
        unique : true,
        trim : true,
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please Enter Valid mail!!"
        ]
    },
    password:{
        type : String,
        require:[true,'please enter a passowrd'],
        minLength : [6, "Password Must be atleast  characters"],
        // maxLength : [12, "Password Must be upto 12 characters"]
    },
    photo:{
        type : String,
        require: [true,"Please add Photo"],
        default:""
    },
    phone:{
        type : String,
        // require: [true,"Please add Photo"],
        default:"+91"
    }

},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User;