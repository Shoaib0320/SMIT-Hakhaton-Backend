import express from 'express';
import {
    createAppointment,
    getAllAppointments,
    getAllLoanRequests,
    //  getApplications,
    updateApplicationStatus
} from '../controllers/adminController.js';

const router = express.Router();

// router.get('/applications', getApplications);
router.put('/update-status', updateApplicationStatus);
router.get("/getAllLoanRequests", getAllLoanRequests);
router.post("/createAppointment", createAppointment)
router.get("/getAllAppointments", getAllAppointments)

export default router;
