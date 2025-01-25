import express from "express";
import LoanApplicationModal from "../models/LoanApplicationModel.js";
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply for Loan
router.post("/apply", verifyToken, async (req, res) => {
  try {
    const { userId, categoryId, subcategory, amount } = req.body;
    const application = new LoanApplicationModal({ userId, categoryId, subcategory, amount });
    await application.save();
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Loan Applications (User-Specific)
router.get("/", verifyToken, async (req, res) => {
  try {
    const applications = await LoanApplicationModal.find({ userId: req.user.id }).populate("categoryId");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get All Loan Applications (Admin Only)
router.get("/all", verifyAdmin, async (req, res) => {
  try {
    const applications = await LoanApplicationModal.find().populate("categoryId userId");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Loan Status (Admin Only)
router.patch("/:id", verifyAdmin, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const updatedApplication = await LoanApplicationModal.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    );
    if (!updatedApplication) return res.status(404).json({ success: false, message: "Loan not found" });
    res.json({ success: true, updatedApplication });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router