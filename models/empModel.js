const  mongoose = require("mongoose")

const empSchema = mongoose.Schema({
  customID:{
    type:String,
    unique:true,
    required:true
  },
    firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      adhaarNo: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      phoneNo: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      hireDate: {
        type: Date,
      },
      salary: {
        type: Number,
      },
      
      // You can add more fields as needed for your employee data.
    }, {
      timestamps: true, // Automatically add createdAt and updatedAt fields
})

const Emp = mongoose.model("Emp", empSchema)

module.exports = Emp;