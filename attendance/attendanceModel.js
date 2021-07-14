const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
 const attandanceSchema = new mongoose.Schema({
	 
	in_time: Date,
	out_time: Date,
	u_id: { type: ObjectId, ref: "UserSchema" },
}, {timestamps : true});

attandanceSchema.index({u_id : 1})


module.exports = mongoose.model("AttandanceModel", attandanceSchema)