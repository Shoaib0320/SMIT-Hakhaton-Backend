import express from "express";
import cloudinary from "cloudinary";
import Category from "../models/Category.js";

// // // Set up Cloudinary config
// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'duvdqnoht',
// 	api_key: process.env.CLOUDINARY_API_KEY || '538347923483567',
// 	api_secret: process.env.CLOUDINARY_API_SECRET || '7TQyo_k4m7_boBRTT8viSXuLix0',
// });

const router = express.Router();

router.get("/", async (req, res) => {
    // console.log("Cloudinary Config:", {
    //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    //     api_key: process.env.CLOUDINARY_API_KEY,
    //     api_secret: process.env.CLOUDINARY_API_SECRET,
    //   });
          
	const categories = await Category.find();
	res.status(200).json({
		msg: "categories fetched successfully",
		error: false,
		data: categories,
	});
});

router.post("/", async (req, res) => {

	const { title, description, } = req.body;

	try {
		const newCategory = new Category({
			title,
			description,
		});

		const savedCategory = await newCategory.save();
		res.status(201).json({
			msg: "Category added successfully",
			data: savedCategory,
			error: false,
		});

	} catch (error) {
		console.error("Error Details:", error); // Log detailed error
		res.status(500).json({
			msg: "Failed to add Category",
			error: error.message, // Send error message for debugging
		});
	}
});

router.put("/:id", async (req, res) => {
	const { title, description,  } = req.body;
	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			{ title, description,  },
			{ new: true } // To return the updated course data
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
			error: true,
		});
	}
});


// Delete course
router.delete("/:id", async (req, res) => {
	try {
		await Category.findByIdAndDelete(req.params.id);
		res.status(200).json({
			msg: "Category deleted successfully",
			error: false,
		});
	} catch (error) {
		res.status(500).json({
			msg: error.message,
			error: true,
		});
	}
});

export default router;




