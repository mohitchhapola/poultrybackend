const  mongoose = require("mongoose")

const moment = require('moment-timezone');

// Set the timezone to IST
moment.tz.setDefault('Asia/Kolkata');


const dailyActSchema = mongoose.Schema({
    customID:{
    type: Number,
    unique:true,
    required:true
    },
    timestampField: {
        type: Date,
        default: ()=> moment().format(), // Set the default value to the current timestamp
      },
    production:{
        type:Number,
        
        required:true,
    },
    rate:{
        type:Number,
        required:true,
    },
    feed:{
        type:Number,
        required:true,
    },
    
})

const dailyAct = mongoose.model("DailyAct", dailyActSchema)

module.exports = dailyAct;