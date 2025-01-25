import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		maxLoan: { type: String, required: true },
		loanPeriod: { type: String, required: true },
	},
	{ timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
