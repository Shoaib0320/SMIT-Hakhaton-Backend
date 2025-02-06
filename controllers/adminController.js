import LoanRequestModel from "../models/LoanRequest.js"
import AppointmentModel from "../models/Appointment.js"

export const getAllLoanRequests = async (req, res) => {
  try {
    const { status, category, dateRange, country, city, userName } = req.query
    const query = {}

    if (status) query.status = status
    if (category) query.category = category
    if (country) query.country = { $regex: country, $options: "i" }
    if (city) query.city = { $regex: city, $options: "i" }
    if (userName) query["user.name"] = { $regex: userName, $options: "i" }
    if (dateRange && dateRange.length === 2) {
      query.createdAt = {
        $gte: new Date(dateRange[0]),
        $lte: new Date(dateRange[1]),
      }
    }

    const loanRequests = await LoanRequestModel.find(query).populate("user", "name email")
    res.status(200).json({ loanRequests })
  } catch (err) {
    console.log("err", err)
    res.status(500).json({ error: err.message })
  }
}

export const updateApplicationStatus = async (req, res) => {
  const { applicationId, status } = req.body
  try {
    const application = await LoanRequestModel.findByIdAndUpdate(applicationId, { status }, { new: true })
    res.status(200).json({ message: "Application status updated", application })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createAppointment = async (req, res) => {
  const { loanRequestId, date, time, officeLocation } = req.body

  console.log('Request Body', req.body);
  
  try {
    const appointment = new AppointmentModel({
      loanRequest: loanRequestId,
      date,
      time,
      officeLocation,
      tokenNumber: `TOK-${Date.now()}` // Generate unique token
    })
    await appointment.save()

    console.log('Appointment', appointment);

    const updatedLoanRequest = await LoanRequestModel.findByIdAndUpdate(
      loanRequestId,
      { appointment: appointment._id },
      { $set: { tokenNumber: `TOK-${new Date().getTime()}` } },
      { new: true },
    )

    res
      .status(201)
      .json({ message: "Appointment created and loan request updated", appointment, loanRequest: updatedLoanRequest })
  } catch (err) {
    console.log('Error', err);
    
    res.status(500).json({ error: err.message })
  }
}

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate("loanRequest")
      .populate({
        path: "loanRequest",
        populate: {
          path: "user",
          select: "name email",
        },
      })
    res.status(200).json({ appointments })
  } catch (err) {
    console.log("err", err)
    res.status(500).json({ error: err.message })
  }
}
