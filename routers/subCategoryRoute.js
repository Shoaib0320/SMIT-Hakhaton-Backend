import express from "express";
import Category from "../models/Category.js";
import SubCategoryModal from "../models/SubCategoryModal.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const { category } = req.query;
  
	try {
	  const filter = category ? { category } : {};
	  const subCategory = await SubCategoryModal.find(filter).populate('category');
	  res.status(200).json({
		msg: "SubCategory fetched successfully",
		error: false,
		data: subCategory,
	  });
	} catch (err) {
	  res.status(500).json({
		msg: "Error fetching subCategory",
		error: true,
		data: [],
	  });
	}
  });
  

router.post("/", async (req, res) => {
	const { title, description, category } = req.body;
  
	try {
	  // Check if the course exists
	  const existingCategory = await Category.findById(category);
	  if (!existingCategory) {
		return res.status(400).json({
		  msg: "Category not found",
		  error: true,
		  data: [],
		});
	  }
  
	  const newSubCategory = new SubCategoryModal({ title, description, category });
	  const savedSubCategory = await newSubCategory.save();
  
	  res.status(201).json({
		msg: "SubCategory added successfully",
		data: savedSubCategory,
		error: false,
	  });
	} catch (err) {
	  res.status(500).json({
		msg: "Error adding subCategory",
		error: true,
		data: [],
	  });
	  console.error(err);
	}
  });
  
  router.put('/:id', async (req, res) => {
	try {
	  const { id } = req.params;
	  const updatedCategoryModal = await SubCategoryModal.findByIdAndUpdate(id, req.body, { new: true });
	  if (!updatedCategoryModal) {
		return res.status(404).send({ error: 'SubCategory not found' });
	  }
	  res.status(200).send({ data: updatedCategoryModal });
	} catch (error) {
	  res.status(500).send({ error: 'Internal Server Error' });
	}
  });
  
  router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
	  const deletedSubCategory = await SubCategoryModal.findByIdAndDelete(id);
	  if (!deletedSubCategory) {
		return res.status(404).send({ message: 'SubCategory not found' });
	  }
	  res.status(200).send({ message: 'SubCategory deleted successfully!' });
	} catch (error) {
	  res.status(500).send({ message: 'Failed to delete SubCategory.' });
	}
  });
  
export default router;