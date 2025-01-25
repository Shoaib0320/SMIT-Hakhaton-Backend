
// Backend: User Model (models/LoanCategoryModal.js)
import mongoose from "mongoose";
const { Schema } = mongoose;

const LoanCategorySchema = Schema({
    name: { type: String, required: true },
    subcategories: [
      {
        name: { type: String, required: true },
        maxLoan: { type: Number, required: true },
      },
    ],
    maxLoan: { type: Number, required: true },
    loanPeriod: { type: Number, required: true },
  });


  const LoanCategoryModal = mongoose.model("LoanCategory", LoanCategorySchema);
  export default LoanCategoryModal;
  