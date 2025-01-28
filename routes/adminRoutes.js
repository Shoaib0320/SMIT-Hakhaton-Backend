import express from 'express';
import {
    createAppointment,
    getAllLoanRequests,
    //  getApplications,
    updateApplicationStatus
} from '../controllers/adminController.js';

const router = express.Router();

// router.get('/applications', getApplications);
router.put('/update-status', updateApplicationStatus);
router.get("/getAllLoanRequests", getAllLoanRequests);
router.post("/createAppointment", createAppointment)

export default router;
