const express = require("express");
const protect = require("../middleWare/authMiddleware");
const {  createData, dataById, getAllData, deleteData, updateData } = require("../controllers/dailyController");
const router = express.Router()

router.post("/",createData)
router.get("/:customID",dataById)
router.delete("/:customID",deleteData)
router.get("/",getAllData)
router.patch("/:customID",updateData)

module.exports = router;