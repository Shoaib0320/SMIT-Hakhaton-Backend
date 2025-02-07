// import mongoose from 'mongoose';

// const loanRequestSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   category: { type: String, required: true },
//   subcategory: { type: String, required: true },
//   deposit: { type: Number, required: true }, // Add deposit field
//   amount: { type: Number, required: true },
//   loanPeriod: { type: Number, required: true },
//   country: { type: String, required: true },
//   city: { type: String, required: true },
//   guarantors: [
//     {
//       name: { type: String, required: true },
//       phoneNumber: { type: String, required: true },
//     },
//   ],  
//   personalInfo: {
//     address: { type: String, required: true },
//     phoneNumber: { type: String, required: true }
//   },
//   statement: { type: String },
//   salarySheet: { type: String },
//   tokenNumber: { type: String , unique: true  },
//   appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
//   status: { 
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending",
//   }
// },{timestamps: true});

// const LoanRequestModel = mongoose.model('LoanRequest', loanRequestSchema);

// export default LoanRequestModel





import mongoose from 'mongoose';

const loanRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  deposit: { type: Number, required: true },
  amount: { type: Number, required: true },
  loanPeriod: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  personalInfo: {
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    // cnicImage: { type: String, required: true } // CNIC image added
  },
  guarantors: [
    {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      // cnicImage: { type: String, required: true } // Guarantor CNIC
    },
  ],
  statement: { type: String },
  salarySheet: { type: String },
  tokenNumber: { type: String , unique: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  status: { 
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }
},{timestamps: true});

const LoanRequestModel = mongoose.model('LoanRequest', loanRequestSchema);

export default LoanRequestModel;
