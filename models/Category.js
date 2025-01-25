import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		// duration: { type: String, required: true },
		// thumbnail: { type: String, required: true },
	},
	{ timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
