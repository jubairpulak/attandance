"use strict"

const bcryptjs = require("bcryptjs")
const comparePass =  (storepass, inputpass) => bcryptjs.compare(inputpass, storepass)
const GroupModel = require("../groups/groupModel")

class AuthService  {
    constructor(Model){
        this.Model = Model;
    }

    async SignUp(DatafromBody){
        const {first_Name, last_Name, password, email, phone_Number} = DatafromBody
        const CheckIsEmailExist = await this.Model.findOne({"contract_Info.email" : email}).lean()
        const CheckIsPhoneExist = await this.Model.findOne({"contract_Info.phone_Number" : phone_Number}).lean()
        if(CheckIsEmailExist){
           return {
               ErrorMessage : "Email has already been used", code : 403, error : true
           }
        }
        else if(CheckIsPhoneExist){
           return {
               ErrorMessage : "Phone Number has already been used", code : 403, error : true
           }
        }
        
        else{

            const createUser = await this.Model.create({
                first_Name,
                last_Name, 
               password : await bcryptjs.hash(password, 12),
                contract_Info:{
                    email,
                    phone_Number
                },
                
            })
            return {
                error : false,
                 data : {
                     userid : createUser._id,
                 }
            };
        } 
}

async Login(DatafromBody) {
    const {email, password} = DatafromBody;  
    const findemail = await this.Model.findOne({"contract_Info.email" : email}).select('+password').lean()
    if(!findemail ) {
        return {
        notfoundmessage : "Email not found", code : 404, error : true
    }}
    const passwordgenerate =await comparePass(findemail.password, password)
    if(!passwordgenerate) {
        return {
            notfoundmessage : "Invalid Password", code : 404, error : true
        }
    }
     
    return {
        error : false,
        data : findemail
    }
}

async findMe(userid){
   
    return await  this.Model.findById({_id : userid}).lean().populate({path : "groupinfo", select :{ "group_Size" :0,  "joining_Code":0, "approve_users":0, "__v":0, "created_By" :0, "createdAt":0, "updatedAt":0}}).exec()
    
    
}


async findUserWithRole(userid , role, variablename){
    let data = variablename;

    const findUser = await this.Model.findById({_id : userid}).lean()
      const v1 = findUser[data]
      console.log(v1)
    return !(role.includes(findUser.role)) ? false: true
}
async getAllData(obj){


    console.log("object query", obj)
    return  this.Model.find(obj).sort({createdAt : -1})
    // return  this.Model.find({}).lean().sort({createdAt : -1})
}

async checkCurrentPassword(userid, currentPassword){

    const findUser = await this.Model.findById({_id : userid}).select('+password').lean()
    const passwordCheck =await comparePass(findUser.password, currentPassword)
    if(!passwordCheck) {
        return {
            notfoundmessage : "Invalid Password", code : 404, error : true
        }
    }
return ""
}

async updateInfo(userid, updateobjectdata){

 

   const updatedata = await this.Model.findByIdAndUpdate({_id : userid}, updateobjectdata , {
    new : true,
    runValidators : true,

})
return updatedata
}

async updateRole(userid){
    const updateUserActiveRole = await this.Model.findByIdAndUpdate({_id : userid}, {"$set":{active: false}})

    if(!updateUserActiveRole) console.log("Kaj hoy nai mamu")
    
    return "Account has been deactivated successfully"
}

async updateRequest(email, slugify){
    // const updateUserActiveRole = await this.Model.findOne({"contract_Info"})
    
    const updateUserActiveRole = await this.Model.findOneAndUpdate({ 'contract_Info.email':email}, {request: "active"},{
        new : true,
        runValidators : true,
    })  
    
    // const findGroupBySlug = await d
    


    const findGroupByslug = await GroupModel.findOneAndUpdate({slugify}, {$push : {approve_users:{user_Ref: updateUserActiveRole._id}} , $inc : {total_Members : 1}}).sort('createdAt').lean()
    const updateUserGroup = await this.Model.findByIdAndUpdate({_id  : updateUserActiveRole._id}, {$set:{groupinfo : findGroupByslug._id}}).sort('createdAt').lean()
    console.log(" group data : ", findGroupByslug)
    
    if(!updateUserActiveRole) console.log("account update hoy nai")  
    
    console.log( "Update User role",updateUserActiveRole)
    return "Account has been Updated"
}

async createGroup(userid, data){
    console.log(userid, data)
    const findgroupbyname = await this.Model.findOne({"group_Name" : data.group_Name}).lean()
    if(findgroupbyname){
        return {
            ErrorMessage : "Group name has already been used", code : 403, error : true
        }
    }

    const createANewGroup = await this.Model.create({

        group_Name : data.group_Name,
        group_Size : data.group_Size,
        slugify : data.slugify,
        joining_Code : data.joining_Code,
        created_By : userid
    }
    )

    return "Group Has been created Successfully"
}


// async getGroupData(){
//     return this.Model.find().sort("createdAt").lean().exec()
//     // const fulldata=await this.Model.find().populate({path:"approve_users", populate:{path : "user_Ref", select: "first_Name last_Name contract_Info"}}).sort("createdAt").lean().exec()
 
//     // console.log("get all group datas",fulldata)

//     // return "okay thik ache"
// }

//postreated

async createPost(groupId, userId, post, title){

    const find ={_id : groupId, $or :[{"created_By":userId},{"approve_users.user_Ref" : userId}]}


    const findUsers = await GroupModel.find(find).sort("createdAt")
    return  this.Model.create({
        title,
        post,
        postBy: userId,
        groupInfo : groupId
    })
    
    
}

async getPost (groupId, userId){
    const find ={_id : groupId, $or :[{"created_By":userId},{"approve_users.user_Ref" : userId}]}
    const findUsers = await GroupModel.find(find).sort("createdAt")

    if(findUsers.group_Name !== '') return this.Model.find({groupInfo : groupId}).sort("-cretedAt")
    return "You are not in this group"

}
}

 

module.exports = AuthService