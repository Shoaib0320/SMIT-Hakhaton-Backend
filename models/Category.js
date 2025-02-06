import mongoose from "mongoose"

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
})

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // subcategories: [subcategorySchema],
    subcategories: [{ type: String }], // Ensure it's an array
    maxLoan: {
      type: Number,
      required: true,
    },
    loanPeriod: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

const Category = mongoose.model("Category", categorySchema)

export default Category

