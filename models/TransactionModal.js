
// Backend: User Model (models/TransactionModal.js)
import mongoose from "mongoose";
const { Schema } = mongoose;

const TransactionSchema = Schema({
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "LoanApplication", required: true },
    amountPaid: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  });

  const TransactionModal = mongoose.model("Transaction", TransactionSchema);
  export default TransactionModal;
  