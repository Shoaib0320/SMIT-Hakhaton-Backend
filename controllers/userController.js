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
  // const { name, email, password, cnic } = req.body;
  // try {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = new UserModel({ name, email, password: hashedPassword, cnic });
  //   await user.save();

  //   // Send email with initial password
  //   // Configure nodemailer in `config/email.js`
  //   res.status(201).json({ message: 'User registered successfully' });
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }

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
  // const { email, password } = req.body;
  // try {
  //   const user = await UserModel.findOne({ email });
  //   if (!user) return res.status(404).json({ error: 'User not found' });

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  //   res.status(200).json({ token, userId: user._id });
  // } catch (err) {
  //   console.log('err=>', err);

  //   res.status(500).json({ error: err.message });
  // }

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

// // Submit Loan Request
// export const submitLoanRequest = async (req, res) => {
//   const { userId, category, subcategory, amount, loanPeriod, personalInfo, guarantors } = req.body;
//   try {
//     const loanRequest = new LoanRequestModel({
//       user: userId,
//       category,
//       subcategory,
//       amount,
//       loanPeriod,
//       personalInfo,
//       guarantors
//     });
//     await loanRequest.save();
//     res.status(201).json({ message: 'Loan request submitted successfully', loanRequest });
//   } catch (err) {
//     console.log('err', err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Generate Slip
// export const generateSlip = async (req, res) => {
//   const { loanRequestId } = req.body;
//   try {
//     const loanRequest = await LoanRequestModel.findById(loanRequestId).populate('appointment');
//     const slip = {
//       tokenNumber: loanRequest.tokenNumber,
//       appointment: loanRequest.appointment,
//       qrCode: await QRCode.toDataURL(`LoanRequest:${loanRequest._id}`)
//     };
//     res.status(200).json({ slip });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const generateTokenNumber = () => {
  // Implement your logic to generate a unique token number here.  For example:
  return Math.random().toString(36).substring(2, 15)
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

// // Generate Slip
// export const generateSlip = async (req, res) => {
//   const { loanRequestId } = req.body;
//   try {
//     const loanRequest = await LoanRequestModel.findById(loanRequestId).populate('appointment');
//     const slip = {
//       tokenNumber: loanRequest.tokenNumber,
//       appointment: loanRequest.appointment,
//       qrCode: await QRCode.toDataURL(`LoanRequest:${loanRequest._id}`)
//     };
//     res.status(200).json({ slip });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




// Generate Slip
export const generateSlip = async (req, res) => {
  const { loanRequestId } = req.params
  try {
    const loanRequest = await LoanRequestModel.findById(loanRequestId)
    if (!loanRequest) {
      return res.status(404).json({ error: "Loan request not found" })
    }

    const canvas = createCanvas(400, 600)
    const ctx = canvas.getContext("2d")

    // Set background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, 400, 600)

    // Draw header
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px Arial"
    ctx.fillText("Loan Request Slip", 100, 50)

    // Draw token number
    ctx.font = "bold 36px Arial"
    ctx.fillText(`Token: ${loanRequest.tokenNumber}`, 100, 150)

    // Draw other details
    ctx.font = "18px Arial"
    ctx.fillText(`Category: ${loanRequest.category}`, 50, 250)
    ctx.fillText(`Amount: ${loanRequest.amount} PKR`, 50, 280)
    ctx.fillText(`Loan Period: ${loanRequest.loanPeriod} months`, 50, 310)
    ctx.fillText(`Status: ${loanRequest.status.toUpperCase()}`, 50, 340)

    // Generate and draw QR code
    const qrCodeDataUrl = await QRCode.toDataURL(`LoanRequest:${loanRequest._id}`)
    const qrCodeImage = await loadImage(qrCodeDataUrl)
    ctx.drawImage(qrCodeImage, 150, 400, 100, 100)

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png")

    // Set response headers
    res.setHeader("Content-Type", "image/png")
    res.setHeader("Content-Disposition", `attachment; filename=loan_slip_${loanRequestId}.png`)

    // Send the image buffer
    res.send(buffer)
  } catch (err) {
    console.error("Error generating slip:", err)
    res.status(500).json({ error: err.message })
  }
}

