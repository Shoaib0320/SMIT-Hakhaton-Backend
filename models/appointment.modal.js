import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
    tokenNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    officeLocation: { type: String, required: true },
  },
  { timestamps: true }
);

let AppointmentModal = mongoose.model("appointment" , appointmentSchema)

export default AppointmentModal
