import LoanRequestModel from "../models/LoanRequest.js";
import AppointmentModel from '../models/Appointment.js';

// View Applications
export const getApplications = async (req, res) => {
  try {
    const applications = await LoanRequestModel.find().populate('user guarantors appointment');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Application Status
export const updateApplicationStatus = async (req, res) => {
  const { applicationId, status } = req.body;
  try {
    const application = await LoanRequestModel.findByIdAndUpdate(applicationId, { status }, { new: true });
    res.status(200).json({ message: 'Application status updated', application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
