import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    category: { type: String, required: true, ref: "category" },
    subcategory: { type: String, required: true },
    initialDeposit: { type: Number, required: true },
    loanAmount: { type: Number, required: true },
    loanPeriod: { type: Number, required: true }, // In days
    breakdown: [
      {
        date: { type: Date },
        amount: { type: Number },
      },
    ],
    guarantors: [
      {
        name: { type: String },
        email: { type: String },
        cnic: { type: String },
        location: { type: String },
      },
    ],
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

let LoanModal = mongoose.model("loanRequest", loanSchema);

export default LoanModal