import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cnic: { type: String, unique: true, required: true },
  role: {
    type: String,
    enum: ["user", "admin",],
    default: "user",
  },
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoanRequest' }]
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel
