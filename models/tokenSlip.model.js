import mongoose from "mongoose";

const tokenSlipSchema = new mongoose.Schema(
  {
    tokenNumber: { type: String, required: true, unique: true },
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    qrCodeUrl: { type: String, required: true }, // Path to QR code image
    slipUrl: { type: String, required: true }, // Path to PDF/JPG slip
    appointmentDetails: {
      date: { type: Date },
      time: { type: String },
      officeLocation: { type: String },
    },
  },
  { timestamps: true }
);

let TokenSlipModal = mongoose.model("TokenSlip", tokenSlipSchema);
export default TokenSlipModal;