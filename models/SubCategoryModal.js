import mongoose from "mongoose";
const { Schema } = mongoose;

const subCategorySchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
	},
	{ timestamps: true }
);

const SubCategoryModal = mongoose.model("SubCategory", subCategorySchema);
export default SubCategoryModal;