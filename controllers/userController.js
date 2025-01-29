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
    expiresIn: "1h",
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
    // console.log("Cookies: ", req); // Debug cookies received

    // const token = req.cookies.token; // Check if token exists
    // if (!token) return res.status(401).json({ msg: "Unauthorized" });

    // const decoded = jwt.verify(token, "secretkey");
    // const user = await User.findById(decoded.id).select("-password");

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
  const { userId, category, subcategory, amount, loanPeriod, country, city, personalInfo, guarantors } = req.body
  try {
    const tokenNumber = generateTokenNumber()
    const loanRequest = new LoanRequestModel({
      user: userId,
      category,
      subcategory,
      amount,
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

export const getLoanRequests = async (req, res) => {
  const { userId } = req.params
  try {
    const loanRequests = await LoanRequestModel.find({ user: userId }).sort({ createdAt: -1 })
    res.status(200).json({ loanRequests })

  } catch (err) {
    console.log("err", err)
    res.status(500).json({ error: err.message })
  }
}

// Generate Slip
export const generateSlip = async (req, res) => {
  const { loanRequestId } = req.params;
  try {
    const loanRequest = await LoanRequestModel.findById(loanRequestId);
    if (!loanRequest) {
      return res.status(404).json({ error: "Loan request not found" });
    }

    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext("2d");

    // Background Styling (Soft Gray)
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, 400, 600);

    // Outer Box (White Slip)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(20, 20, 360, 560);

    // Shadow Effect for Slip
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Header (Professional Look)
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Loan Request Slip", 200, 60);

    // Horizontal Line
    ctx.fillStyle = "#dcdcdc";
    ctx.fillRect(50, 80, 300, 2);

    // Token Number
    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 30px Arial";
    ctx.fillText(`Token: ${loanRequest.tokenNumber}`, 200, 130);

    // Loan Details Section
    ctx.fillStyle = "#34495e";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Category:`, 50, 180);
    ctx.fillText(loanRequest.category, 200, 180);

    ctx.fillText(`Sub Category:`, 50, 220);
    ctx.fillText(loanRequest.subcategory, 200, 220);

    ctx.fillText(`Amount:`, 50, 260);
    ctx.fillText(`${loanRequest.amount} PKR`, 200, 260);

    ctx.fillText(`Loan Period:`, 50, 300);
    ctx.fillText(`${loanRequest.loanPeriod} months`, 200, 300);

    // Loan Status (Professional Look)
    ctx.font = "bold 16px Arial";
    ctx.fillText(`Status:`, 50, 340);

    if (loanRequest.status === "approved") {
      ctx.fillStyle = "#27ae60"; // Green for approved
    } else if (loanRequest.status === "pending") {
      ctx.fillStyle = "#f39c12"; // Orange for pending
    } else {
      ctx.fillStyle = "#c0392b"; // Red for rejected
    }
    ctx.fillText(loanRequest.status.toUpperCase(), 200, 340);

    // QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(`LoanRequest:${loanRequest._id}`);
    const qrCodeImage = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrCodeImage, 140, 420, 120, 120);

    // QR Code Border for a Clean Look
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 3;
    ctx.strokeRect(140, 420, 120, 120);

    // Convert to Buffer
    const buffer = canvas.toBuffer("image/png");

    // Send Response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `attachment; filename=loan_slip_${loanRequestId}.png`);
    res.send(buffer);
  } catch (err) {
    console.error("Error generating slip:", err);
    res.status(500).json({ error: err.message });
  }
};
