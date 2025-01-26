import express from "express"
import { submitLoanForm, updateLoanRequest } from "../controllers/loan.controller.js"

let loanRouter = express.Router()

loanRouter.post("/applyLoan", submitLoanForm)
loanRouter.post("/reviewForm", updateLoanRequest)


export default loanRouter