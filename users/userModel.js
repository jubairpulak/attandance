const mongoose = require('mongoose');

const UserSchema =  new mongoose.Schema({

        first_Name :{
            type : String,
            required : true,
            trim : true
        },
        last_Name :{
            type : String,
            required : true,
            trim : true
        },
       
        password : {
            type : String,
            required : true,
            min: 6,
            select : false,
           
        },
        contract_Info : {
            email : {
                type : String,
                required : true,
                unique : true,
               
                
            },
            phone_Number :{
                type : String,
                required : true,
                min : 11,
                unique : true,
            }
        },
        role :{
            type : String,
            default : "user",
            enum : ["admin", "user"],
        },
       
        
    }, {timestamps : true})

    
    
    UserSchema.index({email : 1, password : 1})
    
    
    

module.exports = mongoose.model("UserSchema", UserSchema)