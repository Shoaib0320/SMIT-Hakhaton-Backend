// import Category from "../models/Category.js";
// import LoanCategoryModal from "../models/LoanCategoryModel.js";
// import express from "express";
// import SubCategoryModal from "../models/SubCategoryModal.js";

// const router = express.Router();

// // Loan Calculation API
// router.post("/", async (req, res) => {
//     try {
//       const { userId, categoryId, subcategory, deposit, loanPeriod } = req.body;
  
//       if (!userId) {
//         return res.status(400).json({ success: false, message: "User ID is required" });
//       }
  
//       const category = await Category.findById(categoryId).lean();
//       if (!category) {
//         return res.status(404).json({ success: false, message: "Category not found" });
//       }
  
//       const subcategories = await SubCategoryModal.find({ category: categoryId });
//       category.subcategories = subcategories.map((sub) => ({ name: sub.title, description: sub.description }));
  
//       if (!category.subcategories.some((sub) => sub.name === subcategory)) {
//         return res.status(400).json({ success: false, message: "Invalid subcategory" });
//       }
  
//       if (loanPeriod > category.loanPeriod) {
//         return res.status(400).json({
//           success: false,
//           message: `Loan period cannot exceed ${category.loanPeriod} years for this category`,
//         });
//       }
  
//       const maxLoanAmount = category.maxLoan;
//       const loanAmount = maxLoanAmount - deposit;
  
//       if (loanAmount <= 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Deposit exceeds or equals the maximum loan amount",
//         });
//       }
  
//       const monthlyInstallment = loanAmount / (loanPeriod * 12);
//       const totalLoanPayable = monthlyInstallment * loanPeriod * 12;
  
//       res.json({
//         success: true,
//         userId,
//         loanAmount,
//         monthlyInstallment: monthlyInstallment.toFixed(2),
//         totalLoanPayable: totalLoanPayable.toFixed(2),
//         loanPeriod,
//       });
//     } catch (error) {
//       console.error("err", error);
//       res.status(500).json({ success: false, error: error.message });
//     }
//   });

// export default router;







import Category from "../models/Category.js"
import express from "express"
import SubCategoryModal from "../models/SubCategoryModal.js"
import LoanModal from "../models/LoanCategoryModel.js"

const router = express.Router()

// Loan Calculation API
// Loan Calculation API
router.post("/calculate", async (req, res) => {
    try {
    
        const { userId, categoryId, subcategory, initialDeposit, loanPeriod } = req.body
    
        // Validate input
        if (!userId || !categoryId || !subcategory || initialDeposit === undefined || !loanPeriod) {
          return res.json({ error: "Missing required fields" }, { status: 400 })
        }
    
        // Fetch the category to get the maxLoan amount
        const category = await Category.findById(categoryId)
        if (!category) {
          return res.json({ error: "Category not found" }, { status: 404 })
        }
    
        const maxLoanAmount = category.maxLoan
        const totalLoanAmount = maxLoanAmount - initialDeposit
    
        if (totalLoanAmount <= 0) {
          return res.json({ error: "Initial deposit exceeds or equals maximum loan amount" }, { status: 400 })
        }
    
        // Assuming 10% annual interest rate
        const annualInterestRate = 0.1
        const monthlyInterestRate = annualInterestRate / 12
        const totalMonths = loanPeriod * 12
    
        // Calculate monthly installment using the formula for fixed monthly payments
        const monthlyInstallment =
          (totalLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
          (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
    
        const totalPayable = monthlyInstallment * totalMonths
    
        const loanCalculation = new LoanModal({
          userId,
          categoryId,
          subcategory,
          initialDeposit,
          loanAmount: totalLoanAmount,
          loanPeriod,
          monthlyInstallment,
          totalPayable,
          interestRate: annualInterestRate,
        })
    
        await loanCalculation.save()
    
        return res.json({
          maxLoanAmount,
          loanAmount: totalLoanAmount,
          monthlyInstallment,
          totalPayable,
          loanPeriod,
          interestRate: annualInterestRate,
        })
      } catch (error) {
        console.error("Loan calculation error:", error)
        return res.json({ error: "An error occurred during calculation." }, { status: 500 })
      }
//   try {
//     const { userId, categoryId, subcategory, deposit, loanPeriod } = req.body

//     // Input validation
//     if (!userId || !categoryId || !subcategory || deposit === undefined || loanPeriod === undefined) {
//       return res.status(400).json({ success: false, message: "Missing required fields" })
//     }

//     const depositAmount = Number.parseFloat(deposit)
//     const loanPeriodYears = Number.parseInt(loanPeriod)

//     if (isNaN(depositAmount) || isNaN(loanPeriodYears)) {
//       return res.status(400).json({ success: false, message: "Invalid deposit or loan period" })
//     }

//     const category = await Category.findById(categoryId).lean()
//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" })
//     }

//     const subcategories = await SubCategoryModal.find({ category: categoryId })
//     category.subcategories = subcategories.map((sub) => ({ name: sub.title, description: sub.description }))

//     if (!category.subcategories.some((sub) => sub.name === subcategory)) {
//       return res.status(400).json({ success: false, message: "Invalid subcategory" })
//     }

//     if (loanPeriodYears > category.loanPeriod) {
//       return res.status(400).json({
//         success: false,
//         message: `Loan period cannot exceed ${category.loanPeriod} years for this category`,
//       })
//     }

//     const maxLoanAmount = category.maxLoan
//     const loanAmount = Math.max(maxLoanAmount - depositAmount, 0)

//     if (loanAmount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Deposit exceeds or equals the maximum loan amount",
//       })
//     }

//     const loanPeriodInMonths = loanPeriodYears * 12
//     const monthlyInstallment = loanAmount / loanPeriodInMonths
//     const totalLoanPayable = monthlyInstallment * loanPeriodInMonths

//     // Check for NaN or Infinity values
//     if (
//       isNaN(loanAmount) ||
//       !isFinite(loanAmount) ||
//       isNaN(monthlyInstallment) ||
//       !isFinite(monthlyInstallment) ||
//       isNaN(totalLoanPayable) ||
//       !isFinite(totalLoanPayable)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid calculation results. Please check your inputs.",
//       })
//     }

//     // Create a new loan record
//     const newLoan = new LoanModal({
//       userId,
//       categoryId,
//       subcategory,
//       initialDeposit: depositAmount,
//       loanAmount: Number(loanAmount.toFixed(2)),
//       loanPeriod: loanPeriodYears,
//       monthlyInstallment: Number(monthlyInstallment.toFixed(2)),
//       totalPayable: Number(totalLoanPayable.toFixed(2)),
//     })

//     await newLoan.save()

//     res.json({
//       success: true,
//       userId,
//       maxLoanAmount: maxLoanAmount.toFixed(2),
//       initialDeposit: depositAmount.toFixed(2),
//       loanAmount: loanAmount.toFixed(2),
//       monthlyInstallment: monthlyInstallment.toFixed(2),
//       totalLoanPayable: totalLoanPayable.toFixed(2),
//       loanPeriod: loanPeriodYears,
//     })
//   } catch (error) {
//     console.error("Loan calculation error:", error)
//     res.status(500).json({ success: false, error: error.message })
//   }
})


export default router





export function calculateLoanBreakdown(initialDeposit, loanAmount, loanPeriod) {
    const totalInstallments = loanPeriod; // Assuming loanPeriod is in days
    const remainingAmount = loanAmount - initialDeposit;
    const installmentAmount = remainingAmount / totalInstallments;
   
    const breakdown = [];
    for (let i = 0; i < totalInstallments; i++) {
      const installmentDate = new Date();
      installmentDate.setDate(installmentDate.getDate() + i + 1); // Daily installment
      breakdown.push({
        date: installmentDate,
        amount: installmentAmount,
      });
    }
  
    return breakdown;
  }
  
  export async function generateTokenSlip(tokenNumber, appointmentDetails) {
    const doc = new PDFDocument({ autoFirstPage: false });
    const filePath = path.join(__dirname, `../uploads/token_slips/Token_${tokenNumber}.pdf`);
  
    // Add a page to the document
    doc.addPage();
    doc.fontSize(18).text(`Token Number: ${tokenNumber}`, { align: "center" });
    doc.fontSize(12).text(`Date: ${appointmentDetails.date}`, { align: "center" });
    doc.fontSize(12).text(`Time: ${appointmentDetails.time}`, { align: "center" });
    doc.fontSize(12).text(`Office Location: ${appointmentDetails.officeLocation}`, { align: "center" });
  
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(tokenNumber);
    const qrImagePath = path.join(__dirname, `../uploads/token_slips/QR_${tokenNumber}.png`);
  
    // Save QR code to image
    await fs.promises.writeFile(qrImagePath, qrCodeDataUrl.split(",")[1], "base64");
  
    // Add QR code image to PDF
    doc.image(qrImagePath, 200, 350, { width: 100 });
  
    // Save the PDF
    doc.pipe(fs.createWriteStream(filePath));
    doc.end();
  
    return filePath.replace(".pdf", ".jpeg"); // Convert to JPEG (could also use a PDF-to-image converter library here)
  }