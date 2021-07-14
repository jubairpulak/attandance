const {slugify} = require("jslugify")
const _ = require("lodash")

const GroupModel = require("./groupModel")
const AppError = require("../error/appError")
const catchAsync = require("../error/catchAsync")
const ValidityClass = require("../services/validationUsingClass")

const AuthGroupClass = require("../services/authService") 


exports.createGroup =catchAsync(async (req, res, next)=>{

    let obj = {}
    
    const isGroupNameValid = new ValidityClass(req.body.group_Name, "Group Name").IsEmpty().IsString().print()
    if(isGroupNameValid) return next(new AppError(isGroupNameValid, 400))

    const isGroupSizeValid = new ValidityClass(req.body.group_Size, "Group Size").IsEmpty().IsNumber().print()
     if(isGroupSizeValid) return next(new AppError(isGroupSizeValid, 400))

     obj.slug = req.body.group_Name
     req.body.slugify  = slugify(obj, lowercase = "true", replacement = "_")

     req.body.joining_Code= _.times(8, () => _.random(35).toString(36)).join('');



     console.log("random data : ", req.body)

     const GroupCreateData  = await new AuthGroupClass(GroupModel).createGroup( req.user.userid, req.body)

     if(GroupCreateData.error === true) return next (new AppError(GroupCreateData.ErrorMessage, GroupCreateData.code))
     res.status(201).send(GroupCreateData)

})


exports.getGroupsInfo = catchAsync(async(req, res, next)=>{
    let obj ={}
    

    const getGroupList = await new AuthGroupClass(GroupModel).getAllData(obj)
    console.log("all group remaining Seats: ",getGroupList[0]['remaining_Seats'])
    res.status(201).json({
        status : "success",
        data : {
            getGroupList
        }
    })
})