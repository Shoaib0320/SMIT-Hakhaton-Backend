import express from 'express';
import { registerUser, loginUser, submitLoanRequest, generateSlip } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/submit-loan', submitLoanRequest);
router.post('/generate-slip', generateSlip);

export default router;
