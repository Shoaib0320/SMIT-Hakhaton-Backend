import express from 'express';
import { registerUser, loginUser, submitLoanRequest, 
    generateSlip, 
    getUserData, 
    getLoanRequests,
    } from '../controllers/userController.js';
import { upload } from '../config/CloudnaryConfig.js';
import LoanRequestModel from '../models/LoanRequest.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/submit-loan', submitLoanRequest);
router.get('/getLoanRequests/:userId', getLoanRequests);
router.get('/generateSlip/:loanRequestId', generateSlip);

router.get("/profile", getUserData);

// Middleware for file upload
const uploadFields = upload.fields([
  { name: "userCnic", maxCount: 1 },
  { name: "guarantorCnic", maxCount: 3 }, // Maximum 3 guarantors
]);

router.post("/submit-loan", uploadFields, async (req, res) => {
  try {
    const { userId, category, subcategory, amount, loanPeriod, deposit, country, city, personalInfo, guarantors } = req.body;

    console.log('Request Body', req.body);

    const tokenNumber = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit token

    const loanRequest = new LoanRequestModel({
      user: userId,
      category,
      subcategory,
      amount,
      deposit,
      loanPeriod,
      country, 
      city,
      personalInfo: {
        ...JSON.parse(personalInfo),
        cnicImage: req.files["userCnic"] ? req.files["userCnic"][0].path : null,
      },
      guarantors: JSON.parse(guarantors).map((g, index) => ({
        ...g,
        cnicImage: req.files["guarantorCnic"] && req.files["guarantorCnic"][index] 
          ? req.files["guarantorCnic"][index].path 
          : null,
      })),
      tokenNumber,
      status: "pending",
    });

    await loanRequest.save();
    res.status(201).json({ message: "Loan request submitted successfully", loanRequest });
  } catch (err) {
    console.error("Error submitting loan request:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
