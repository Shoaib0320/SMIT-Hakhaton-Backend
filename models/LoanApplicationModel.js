
// Backend: User Model (models/LoanApplicationModal.js)
import mongoose from "mongoose";
const { Schema } = mongoose;

const LoanApplicationSchema = Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  remarks: { type: String },
  appliedAt: { type: Date, default: Date.now },
});

  const LoanApplicationModal = mongoose.model("LoanApplication", LoanApplicationSchema);
  export default LoanApplicationModal;
  