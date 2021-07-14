
const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const groupSchema = new mongoose.Schema({
    group_Name : {
        type : String,
        unique : true,
        required : true

    },
    group_Size:{
        type : Number,
        
        required : true
    },
    slugify: String,
    joining_Code:{
        type : String,
        unique : true,
        required : true,
    },
    approve_users:[{

      
            user_Ref:{type : ObjectId, ref : "UserSchema"},   
     
        joining_Time:{
             type : Date,
             default : Date.now()
            },
       
    }],
    total_Members : Number,
    created_By:{
        type : ObjectId, ref : "UserSchema"
    }


},{
    toJSON: {virtuals: true},
    toObject : {virtuals : true},

},
{
    timestamps: true,
    
})

groupSchema.virtual('remaining_Seats').get(function(){
    console.log("amar ei khane run hoyche")
    return this.group_Size - this.total_Members
})

groupSchema.pre(/^find/, function(next){
    this.populate({path:"approve_users", populate:{path : "user_Ref", select: {"first_Name" :1, "last_Name" :1, "contract_Info":1, "groupn" :1}}})
    next()
})
groupSchema.index({group_Name : 1, slugify : 1})



module.exports = mongoose.model("GroupData", groupSchema)