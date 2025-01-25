import express from "express";
import Category from "../models/Category.js";
import SubCategoryModal from "../models/SubCategoryModal.js";

const router = express.Router();

// Fetch all categories
router.get("/", async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(200).json({
			msg: "Categories fetched successfully",
			error: false,
			data: categories,
		});
	} catch (error) {
		res.status(500).json({
			msg: "Failed to fetch categories",
			error: error.message,
		});
	}
});

// Add a new category
router.post("/", async (req, res) => {
	const { title, description, maxLoan, loanPeriod } = req.body;

	try {
		const newCategory = new Category({
			title,
			description,
			maxLoan,
			loanPeriod,
		});

		const savedCategory = await newCategory.save();
		res.status(201).json({
			msg: "Category added successfully",
			data: savedCategory,
			error: false,
		});
	} catch (error) {
		console.error("Error adding Category:", error);
		res.status(500).json({
			msg: "Failed to add Category",
			error: error.message,
		});
	}
});

// Update a category by ID
router.put("/:id", async (req, res) => {
	const { title, description, maxLoan, loanPeriod } = req.body;

	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			{ title, description, maxLoan, loanPeriod },
			{ new: true } // To return the updated category data
		);

		res.status(200).json({
			msg: "Category updated successfully",
			data: updatedCategory,
			error: false,
		});
	} catch (error) {
		console.error("Error updating Category:", error);
		res.status(500).json({
			msg: "Failed to update Category",
			error: error.message,
		});
	}
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
	try {
		await Category.findByIdAndDelete(req.params.id);
		res.status(200).json({
			msg: "Category deleted successfully",
			error: false,
		});
	} catch (error) {
		res.status(500).json({
			msg: "Failed to delete Category",
			error: error.message,
		});
	}
});

// Fetch all categories with their subcategories
router.get("/with-subcategories", async (req, res) => {
	try {
		// Fetch categories and populate subcategories
		const categories = await Category.find().lean();

		const categoriesWithSubcategories = await Promise.all(
			categories.map(async (category) => {
				const subcategories = await SubCategoryModal.find({ category: category._id });
				return {
					...category,
					subcategories,
				};
			})
		);

		res.status(200).json({
			msg: "Categories with subcategories fetched successfully",
			error: false,
			data: categoriesWithSubcategories,
		});
	} catch (error) {
		res.status(500).json({
			msg: "Failed to fetch categories with subcategories",
			error: error.message,
		});
	}
});

// Fetch a single category by ID
router.get("/singleCategory/:id", async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({ msg: "Category not found", error: true });
		}
		const categoriesWithSubcategories = await Promise.all(
			category.map(async (category) => {
				const subcategories = await SubCategoryModal.find({ category: category._id });
				return {
					...category,
					subcategories,
				};
			})
		);

		res.status(200).json({
			msg: "Categories with subcategories fetched successfully",
			error: false,
			data: categoriesWithSubcategories,
		});
	} catch (error) {
		res.status(500).json({
			msg: "Failed to fetch category",
			error: error.message,
		});
	}
});

export default router;
