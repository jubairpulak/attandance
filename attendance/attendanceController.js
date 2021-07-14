
"use strict"
const dot = require('dot-object');
const bcryptjs = require("bcryptjs")
const moment = require('moment');

const _ = require("lodash")
const catchAsync = require("../error/catchAsync");
const AppError = require("../error/appError");
// const {checkValidation} = require("../services/validationService")

const ValidityClass = require("../services/validationUsingClass");
const AuthService = require("../services/authService");
const UserModel = require("../users/userModel")
 const attandanceModel = require("./attendanceModel")


exports.createAttandance = catchAsync(async (req, res, next) =>
{
    const { userid } = req.user
  const findU_Id = await attandanceModel.findOne({u_id : userid})

    if (findU_Id) {
        return res.status(403).json({
            status: "failed",
            message : "Already Submitted your data"
        })
    }
    const makeAttandance = await attandanceModel.create({  
	in_time: Date.now(),
	u_id:userid
    })
    
    res.status(201).json({
        status: "success",
        message : "Attandance Done"
    })
    
})

exports.updateAttandance = catchAsync(async (req, res, next) =>
{
    const { userid } = req.user
  const findU_Id = await attandanceModel.findOne({u_id : userid})

    if (!findU_Id) {
        return res.status(403).json({
            status: "failed",
            message : "You haven't submit your attandance"
        })
    }
    const makeouttimeofAttandance = await attandanceModel.findOneAndUpdate({u_id: userid}, {"$set":{out_time: Date.now()}})
    
    res.status(201).json({
        status: "success",
        message : "Update Out time of your attandance"
    })
    
})