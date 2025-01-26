import mongoose from "mongoose";
const { Schema } = mongoose;

const LoanSchema = Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User schema
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
    trim: true,
  },
  initialDeposit: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value >= 0,
      message: "Deposit cannot be negative",
    },
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  loanPeriod: {
    type: Number,
    required: true,
  },
  monthlyInstallment: {
    type: Number,
    required: true,
  },
  totalPayable: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LoanModal = mongoose.model("Loan", LoanSchema);
export default LoanModal