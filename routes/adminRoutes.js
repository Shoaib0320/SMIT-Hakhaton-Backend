import express from 'express';
import { getApplications, updateApplicationStatus } from '../controllers/adminController.js';

const router = express.Router();

router.get('/applications', getApplications);
router.put('/update-status', updateApplicationStatus);

export default router;
