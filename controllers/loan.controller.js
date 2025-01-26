import { calculateLoanBreakdown, convertPasswordToHash, generateRandomPassword, generateTokenSlip, sendRejectEmail, sendResetPasswordEmail } from "../lib/utility.js";
import AppointmentModal from "../models/appointment.modal.js";
import LoanModal from "../models/loan.model.js";
import UserModal from "../models/user.models.js";

/**
 * Submit Loan Form
 */
export async function submitLoanForm(req, res) {
    try {
        const {
            category,
            subcategory,
            initialDeposit,
            loanAmount,
            loanPeriod,
            guarantors,
            email,
            CNIC,
            name,
            phone,
            address,
            city,
            country,
        } = req.body;

        // Validate required fields
        if (
            !category ||
            !subcategory ||
            !initialDeposit ||
            !loanAmount ||
            !loanPeriod ||
            !guarantors ||
            guarantors.length === 0
            || !name || !email || !CNIC || !city || !country
        ) {
            return res.status(400).json({
                error: true,
                message: "All fields are required, including at least one guarantor.",
            });
        }

        // Calculate loan breakdown (installment amounts)
        const breakdown = calculateLoanBreakdown(initialDeposit, loanAmount, loanPeriod);

        // Check if the user already exists based on CNIC or email
        let isUserRegistered = await UserModal.findOne({
            $or: [{ CNIC }, { email }],
        });

        // If user doesn't exist, create a new user
        if (!isUserRegistered) {
            // Generate a random password for the new user
            let password = generateRandomPassword(12);
            const hashedPassword = await convertPasswordToHash(password);

            // Create new user object
            const userObj = {
                name,
                email,
                cnic: CNIC,
                password: hashedPassword, // Auto-generated password
                role: "user",
                city,
                country,
                phone,
                address,
            };

            // Create the new user and save to the database
            const newUser = new UserModal(userObj);
            await newUser.save();

            // Send a password reset email to the user
            await sendResetPasswordEmail(email, password);

            // Get the userId of the newly created user
            isUserRegistered = newUser;
        }

        // Create loan object with the userId from the newly created or found user
        const loanObj = {
            userId: isUserRegistered._id, // Use the userId of the registered or newly created user
            category,
            subcategory,
            initialDeposit,
            loanAmount,
            loanPeriod,
            breakdown,
            guarantors,
            status: "Pending", // Default loan status
        };

        // Save loan request to the database
        const newLoan = new LoanModal(loanObj);
        await newLoan.save();

        res.status(201).json({
            error: false,
            message: "Loan form submitted successfully.",
            data: newLoan,
        });
    } catch (error) {
        console.error("Error in submitLoanForm:", error.message);
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}



// export async function upadateLoanRequest(req, res) {
//     try {
//         let findRequest = LoanModal.findById(req.body.requestId)

//         if (!findRequest) {
//             res.send({
//                 error: true,
//                 message: "No Request Found There is an error"
//             })
//         }

//         if (findRequest.status === "Approved") {

//         } else if (findRequest.status === "Rejected") {
//             if (!req.body.rejectedReason) {
//                 return res.send({
//                     error: true,
//                     message: "Please Write The Rejected Reason"
//                 })
//             }
//             findRequest.status = "Rejected"
//             await sendRejectEmail(req.body.email, req.body.rejectedReason)
//         }
//     } catch (e) {

//     }
// }


export async function updateLoanRequest(req, res) {
    try {
        const { requestId, email, rejectedReason, appointmentDetails, status } = req.body;

        // Find the loan request by its ID
        let findRequest = await LoanModal.findById(requestId);

        if (!findRequest) {
            return res.status(404).send({
                error: true,
                message: "No request found, there is an error.",
            });
        }

        // Handle loan request status update to "Approved"
        if (status === "Approved") {
            // If it's already approved, return an error
            // if (findRequest.status === "Approved") {
            //     return res.status(400).send({
            //         error: true,
            //         message: "This loan request is already approved.",
            //     });
            // }

            // Update loan status to approved
            findRequest.status = "Approved";
            await findRequest.save();

            // Generate a unique token for the user
            const tokenNumber = `TOKEN-${findRequest._id.toString()}`; // Generate token from loan request ID

            // Schedule the appointment
            const appointment = new AppointmentModal({
                loanId: requestId,
                userId: findRequest.userId,
                tokenNumber,
                date: appointmentDetails.date,
                time: appointmentDetails.time,
                officeLocation: appointmentDetails.officeLocation,
            });

            await appointment.save();

            // Generate token slip (JPEG image)
            const tokenSlipImage = await generateTokenSlip(tokenNumber, appointmentDetails);

            // Send an email with the token slip to the user
            await sendEmail(
                email,
                "Loan Request Approved",
                "Your loan request has been approved. Please find your token slip attached.",
                [
                    {
                        filename: `Token_${tokenNumber}.jpeg`,
                        path: tokenSlipImage,
                        encoding: "base64",
                    },
                ]
            );

            // Return response for approval
            return res.status(200).send({
                error: false,
                message: "Loan request approved, appointment scheduled, and email sent with token slip.",
                data: {
                    loanRequestId: findRequest._id,
                    status: findRequest.status,
                    tokenNumber,
                    appointment: appointmentDetails,
                },
            });
        }

        // Handle loan request status update to "Rejected"
        if (status === "Rejected") {
            // If it's already rejected, return an error
            // if (findRequest.status === "Rejected") {
            //     return res.status(400).send({
            //         error: true,
            //         message: "This loan request is already rejected.",
            //     });
            // }

            // If rejection reason is missing, return an error
            if (!rejectedReason) {
                return res.status(400).send({
                    error: true,
                    message: "Please provide the rejected reason.",
                });
            }

            // Update loan status to rejected
            findRequest.status = "Rejected";
            await findRequest.save();

            // Send an email to the user with the rejection reason
            await sendEmail(
                email,
                "Loan Request Rejected",
                `Your loan request has been rejected. Reason: ${rejectedReason}`,
                []
            );

            // Return response for rejection
            return res.status(200).send({
                error: false,
                message: "Loan request rejected successfully, email sent with the reason.",
                data: {
                    loanRequestId: findRequest._id,
                    status: findRequest.status,
                    rejectedReason,
                },
            });
        }

        // If status is not approved or rejected, return an error
        return res.status(400).send({
            error: true,
            message: "Invalid status provided.",
        });
    } catch (e) {
        console.error("Error in updateLoanRequest:", e.message);
        res.status(500).send({
            error: true,
            message: e.message,
        });
    }
}