const mongoose = require("mongoose");
const LeaveSchema = mongoose.Schema({

  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  date:{type:Date},
  fullName:{type:String,required:true},
  email:{type:String,required:true},
  
  startDate:{type:Date,required:true},
  endDate:{type:Date,required:true},
  type:{type:String,required:true},
  note:{type:String},
  certif:{type:String},
  code:{type:String},

  status:{type:String, default: "Pending 0/2"},
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  managerAccepted:{type:Boolean,default:false},
  supervisorAccepted:{type:Boolean,default:false}
  
},
{
  timestamps: true
});
LeaveSchema.index({ createdAt: 1 });
LeaveSchema.index({ startDate: 1, endDate: 1 });
LeaveSchema.index({ status: 1 });
LeaveSchema.index({ type: 1 });
module.exports = mongoose.model("Leave", LeaveSchema);
