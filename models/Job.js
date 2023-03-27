const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String, // type
      required: [true, "Please provide position"], // if required, error message
      maxlength: 100, // maxlenength
    },
    status: {
      type: String, // type
      enum: ["interview", "dedlined", "pending"], // posible values
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      // connect JobModel to UserModel
      ref: "User",
      // to which model we are referencing - User Model
      required: [true, "Please provide user model"],
    },
  },
  { timestamps: true }
);

module.exports = module.model("Job", JobSchema);
