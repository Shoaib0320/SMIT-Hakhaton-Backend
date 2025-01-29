import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  loanRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanRequest', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  officeLocation: { type: String, required: true },
  tokenNumber: { type: String, unique: true, required: true } // Added tokenNumber
});

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel
