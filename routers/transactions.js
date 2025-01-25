import TransactionModal from "../models/TransactionModal";


const router = express.Router();

// Create Transaction
router.post("/", verifyToken, async (req, res) => {
  try {
    const { loanId, amountPaid } = req.body;
    const transaction = new TransactionModal({ loanId, amountPaid });
    await transaction.save();

    // Mark Loan as Paid if Fully Paid (Optional)
    const loan = await LoanApplicationModal.findById(loanId);
    if (loan && loan.amount <= amountPaid) {
      loan.status = "paid";
      await loan.save();
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Transactions for a Loan
router.get("/:loanId", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ loanId: req.params.loanId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
