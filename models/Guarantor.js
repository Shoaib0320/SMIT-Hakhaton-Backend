import mongoose from 'mongoose';

const guarantorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  cnic: { type: String, required: true }
});

const GuarantorModel = mongoose.model('Guarantor', guarantorSchema);

export default GuarantorModel