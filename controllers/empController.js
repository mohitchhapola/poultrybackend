const asyncHandler = require("express-async-handler");
const Emp = require("../models/empModel");

//create product 

const createEmp = asyncHandler(async(req,res)=>{
    const {customID,  firstName, lastName, adhaarNo, address, phoneNo } = req.body;

    // console.log(req.body)

    if(!customID || !firstName || !adhaarNo || !phoneNo){
        res.status(400);
        throw new Error('Please enter all the fields');
    }

    const empExist = await Emp.findOne({ customID });
    if (empExist){
        res.status(400);
        throw new Error("Employee already Exist");
    }
    
    const emp = await Emp.create({
        customID,
        firstName,
        adhaarNo,
        phoneNo
    })
     if (emp) {
        const {customID,firstname,phoneNo,adhaarNo} = emp
        res.status(201).json({
            customID,
            firstName,
            phoneNo,
            adhaarNo,
        })
     }
     else{
        res.status(400);
        throw new Error("Invalid Employee Data")
     }
});


//update employee
const updateEmp = asyncHandler(async (req, res) => {
    const { customID } = req.params;

    const emp = await Emp.findOne({ customID });
  
    if (employee) {
      const { firstName, lastName, phoneNo, adhaarNo, address } = req.body;
      employee.firstName = firstName || employee.firstName;
      employee.lastName = lastName || employee.lastName;
      employee.phoneNo = phoneNo || employee.phoneNo;
      employee.adhaarNo = adhaarNo || employee.adhaarNo;
      employee.address = address || employee.address;
  
      const updatedEmployee = await employee.save();
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404);
      throw new Error("Employee Not Found");
    }
  });


//get all employee
  const getAllEmp = asyncHandler(async(req,res)=>{
    const emp = await Emp.find({});
    res.status(200).json(emp);
  })


// get employee by id
  const getEmpId = asyncHandler(async(req,res)=>{
    const { customID } = req.params;

    const emp = await Emp.findOne({ customID });

    if(emp){
        res.status(200).json(emp)
    }else{
        res.status(400)
        throw new Error("Employee not Found")
    }
  })

  //delete employee by id

  const deleteEmp = asyncHandler(async (req, res) => {
    const { customID } = req.params;
    const emp = await Emp.findOneAndDelete({ customID });
  
    if (!customID) {
      res.status(400);
      throw new Error("Invalid customID");
    }
    if (!emp) {
      res.status(404);
      throw new Error("Employee Not Found");
    }
    res.status(200).json({ message: "Employee deleted" });
  });



module.exports = {
    createEmp,
    updateEmp,
    getAllEmp,
    getEmpId,
    deleteEmp,
}