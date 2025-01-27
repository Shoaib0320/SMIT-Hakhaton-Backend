import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  loanRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanRequest', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  officeLocation: { type: String, required: true }
});

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel
