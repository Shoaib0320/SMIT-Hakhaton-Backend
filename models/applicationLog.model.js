import mongoose from "mongoose";

const applicationLogSchema = new mongoose.Schema(
  {
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    action: { type: String, enum: ["Created", "Updated", "Approved", "Rejected"], required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin
  },
  { timestamps: true }
);

let ApplicationLogModal = mongoose.model("applicationLog", applicationLogSchema);
export default ApplicationLogModal
