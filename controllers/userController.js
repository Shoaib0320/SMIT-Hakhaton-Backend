import Guarantor from '../models/Guarantor.js';
import Appointment from '../models/Appointment.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import UserModel from '../models/User.js';
import LoanRequestModel from '../models/LoanRequest.js';

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, cnic } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword, cnic });
    await user.save();

    // Send email with initial password
    // Configure nodemailer in `config/email.js`
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    console.log('err=>', err);
    
    res.status(500).json({ error: err.message });
  }
};

// Submit Loan Request
export const submitLoanRequest = async (req, res) => {
  const { userId, category, subcategory, amount, loanPeriod, personalInfo, guarantors } = req.body;
  try {
    const loanRequest = new LoanRequestModel({ 
      user: userId, 
      category, 
      subcategory, 
      amount, 
      loanPeriod, 
      personalInfo, 
      guarantors 
    });
    await loanRequest.save();
    res.status(201).json({ message: 'Loan request submitted successfully', loanRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate Slip
export const generateSlip = async (req, res) => {
  const { loanRequestId } = req.body;
  try {
    const loanRequest = await LoanRequestModel.findById(loanRequestId).populate('appointment');
    const slip = {
      tokenNumber: loanRequest.tokenNumber,
      appointment: loanRequest.appointment,
      qrCode: await QRCode.toDataURL(`LoanRequest:${loanRequest._id}`)
    };
    res.status(200).json({ slip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
