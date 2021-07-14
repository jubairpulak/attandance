

const express = require("express")
const router = express.Router();

const {userauthorization} = require("../middleware/userMiddleware")
const {createAttandance, updateAttandance} = require("./attendanceController")
router.route("/add").post(userauthorization, createAttandance)
router.route("/update").patch(userauthorization, updateAttandance)


module.exports = router