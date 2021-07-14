const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema


const CommentSchema = mongoose.Schema({
    postId:{type : ObjectId, ref: "PostSchema" },
    commentBy:{type : ObjectId, ref :"UserSchema"},
    comment:{
        type : String,

    }

},{timestamps: true})

module.exports = mongoose.model("CommentSchema", CommentSchema)