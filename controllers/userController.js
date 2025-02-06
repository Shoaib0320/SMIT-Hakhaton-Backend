import Guarantor from '../models/Guarantor.js';
import Appointment from '../models/Appointment.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import UserModel from '../models/User.js';
import LoanRequestModel from '../models/LoanRequest.js';
import { createCanvas, loadImage } from "canvas"

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role, cnic } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword, role, cnic });
    await newUser.save();

    const token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ msg: "User registered successfully", token });
  } catch (error) {
    console.log('err', error);
    res.status(500).json({ msg: "Error registering user", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    console.log('token', token)
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ msg: "Login successful", token, role: user.role, name: user.name, email: user.email, });
  } catch (error) {
    console.log('err', error);

    res.status(500).json({ msg: "Error logging in", error: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    const authHeader = req.headers.authorization; // Get the Authorization header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token part (after "Bearer ")
    console.log('token in profile  ', token)
    // Verify the token (using JWT or your chosen library)
    console.log('jwtseceret', process.env.JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        console.log(err)
        return res.status(403).json({ msg: "Invalid or expired token" });
      }

      // Token is valid, proceed with the request
      req.user = user; // Attach the decoded user data to the request object
      const singleUser = await UserModel.findOne({ email: user.email })
      console.log('singe user', singleUser)
      console.log('user in profile', user)
      res.status(200).json({ msg: "Token is valid", user: singleUser });
    });

  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ msg: "Error fetching user data", error: error.message });
  }
}

// Generate Numeric Token (4 or 6 Digits)
const generateTokenNumber = () => {
  return Math.floor(1000 + Math.random() * 9000) // 4-digit token
  // return Math.floor(100000 + Math.random() * 900000) // 6-digit token (if required)
}

export const submitLoanRequest = async (req, res) => {

  const { userId, category, subcategory, amount, loanPeriod, deposit, country, city, personalInfo, guarantors } = req.body
  console.log('Request Body', req.body);
  
  try {
    const tokenNumber = generateTokenNumber()
    const loanRequest = new LoanRequestModel({
      user: userId,
      category,
      subcategory,
      amount,
      deposit,
      loanPeriod,
      country, 
      city,
      personalInfo,
      guarantors,
      tokenNumber,
      status: "pending",
    })
    await loanRequest.save()
    res.status(201).json({ message: "Loan request submitted successfully", loanRequest })
  } catch (err) {
    console.log("err", err)
    res.status(500).json({ error: err.message })
  }
}

export const generateSlip = async (req, res) => {
  const { loanRequestId } = req.params
  try {
    const loanRequest = await LoanRequestModel.findById(loanRequestId).populate("appointment")
    if (!loanRequest) {
      return res.status(404).json({ error: "Loan request not found" })
    }

    const canvas = createCanvas(400, 700)
    const ctx = canvas.getContext("2d")

    // Background
    ctx.fillStyle = "#f0f4f8"
    ctx.fillRect(0, 0, 400, 700)

    // Slip background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(20, 20, 360, 660)

    // Shadow effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3

    // Header
    ctx.fillStyle = "#1a365d"
    ctx.font = "bold 28px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Loan Request Slip", 200, 60)

    // Horizontal line
    ctx.strokeStyle = "#4299e1"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(50, 80)
    ctx.lineTo(350, 80)
    ctx.stroke()

    // Token Number
    ctx.fillStyle = "#e53e3e"
    ctx.font = "bold 32px Arial"
    ctx.fillText(`Token: ${loanRequest.tokenNumber}`, 200, 130)

    // Loan Details
    ctx.fillStyle = "#2d3748"
    ctx.font = "18px Arial"
    ctx.textAlign = "left"

    const details = [
      { label: "Category:", value: loanRequest.category },
      { label: "Sub Category:", value: loanRequest.subcategory },
      { label: "Amount:", value: `${loanRequest.amount} PKR` },
      { label: "Loan Period:", value: `${loanRequest.loanPeriod} months` },
    ]

    details.forEach((detail, index) => {
      ctx.fillText(detail.label, 50, 180 + index * 40)
      ctx.fillText(detail.value, 200, 180 + index * 40)
    })

    // Appointment Details
    ctx.fillStyle = "#2b6cb0"
    ctx.font = "bold 22px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Appointment Details", 200, 380)

    ctx.fillStyle = "#2d3748"
    ctx.font = "18px Arial"
    ctx.textAlign = "left"

    if (loanRequest.appointment) {
      const appointmentDate = new Date(loanRequest.appointment.date).toLocaleDateString()
      ctx.fillText(`Date: ${appointmentDate}`, 50, 420)
      ctx.fillText(`Time: ${loanRequest.appointment.time}`, 50, 460)
      ctx.fillText(`Location: ${loanRequest.appointment.officeLocation}`, 50, 500)
    } else {
      ctx.fillText("Appointment not scheduled yet", 50, 420)
    }

    // QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(`LoanRequest:${loanRequest._id}`)
    const qrCodeImage = await loadImage(qrCodeDataUrl)
    ctx.drawImage(qrCodeImage, 140, 540, 120, 120)

    // QR Code Border
    ctx.strokeStyle = "#4299e1"
    ctx.lineWidth = 3
    ctx.strokeRect(140, 540, 120, 120)

    // Convert to Buffer
    const buffer = canvas.toBuffer("image/png")

    // Send Response
    res.setHeader("Content-Type", "image/png")
    res.setHeader("Content-Disposition", `attachment; filename=loan_slip_${loanRequestId}.png`)
    res.send(buffer)
  } catch (err) {
    console.error("Error generating slip:", err)
    res.status(500).json({ error: err.message })
  }
}

export const getLoanRequests = async (req, res) => {
  const { userId } = req.params
  try {
    const loanRequests = await LoanRequestModel.find({ user: userId }).sort({ createdAt: -1 }).populate("appointment")
    res.status(200).json({ loanRequests })
  } catch (err) {
    console.log("err", err)
    res.status(500).json({ error: err.message })
  }
}

