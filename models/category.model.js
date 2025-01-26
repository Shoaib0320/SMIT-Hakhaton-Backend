import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subcategories: [{ type: String, required: true }], // List of subcategories
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin
  },
  { timestamps: true }
);

let CategoryModal = mongoose.model('category' , categorySchema)

export default CategoryModal
