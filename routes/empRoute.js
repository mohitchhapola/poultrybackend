const express = require("express");
const protect = require("../middleWare/authMiddleware");
const {  createEmp, updateEmp, getAllEmp, getEmpId, deleteEmp } = require("../controllers/empController");
const router = express.Router()

router.post("/", protect, createEmp)
router.patch("/update/:customID", protect, updateEmp),
router.get("/",protect,getAllEmp)
router.get("/:customID",protect,getEmpId)
router.delete("/:customID",protect,deleteEmp)



module.exports = router;