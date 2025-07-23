const mongoose = require("mongoose");

const bugSchema = mongoose.Schema(
    {
        bug_name: {type:String, required:true, trim:true},
        bug_level: {type:String, required:true},
        bug_description:{type:String, required:true},
        bug_status:{type:String, default:"Open"},
        user_id: {ref:"User", type:mongoose.Schema.Types.ObjectId , required:true}
    },
    {
        timestamps: true
    }
)


const Bugs = mongoose.model("Bugs", bugSchema)
module.exports = Bugs;