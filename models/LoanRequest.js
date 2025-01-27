import mongoose from 'mongoose';

const loanRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  amount: { type: Number, required: true },
  loanPeriod: { type: Number, required: true },
  guarantors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guarantor' }],
  personalInfo: {
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },
  statement: { type: String },
  salarySheet: { type: String },
  tokenNumber: { type: String },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  status: { type: String, default: 'Pending' }
});

const LoanRequestModel = mongoose.model('LoanRequest', loanRequestSchema);

export default LoanRequestModel
