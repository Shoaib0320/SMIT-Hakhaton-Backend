import mongoose from 'mongoose';

const loanRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  // subcategory: { type: String, required: true },
  amount: { type: Number, required: true },
  loanPeriod: { type: Number, required: true },
  // guarantors: [{ type: String, required: true}],
  guarantors: [
    {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
  ],  
  personalInfo: {
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },
  statement: { type: String },
  salarySheet: { type: String },
  tokenNumber: { type: String },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  status: { 
    // type: String, default: 'Pending' 
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }
});

const LoanRequestModel = mongoose.model('LoanRequest', loanRequestSchema);

export default LoanRequestModel
