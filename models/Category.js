import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		maxLoan: { type: Number, required: true }, // Ensure this is a number
		loanPeriod: { type: Number, required: true }, // Ensure this is a number
		subcategories: [
			{
				name: { type: String, required: true },
				description: String,
			},
		],
	},
	{ timestamps: true }
);


const Category = mongoose.model("Category", categorySchema);
export default Category;
