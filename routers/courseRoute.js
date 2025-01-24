import express from "express";
import cloudinary from "cloudinary";
import Course from "../models/Course.js";

// // Set up Cloudinary config
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'duvdqnoht',
	api_key: process.env.CLOUDINARY_API_KEY || '538347923483567',
	api_secret: process.env.CLOUDINARY_API_SECRET || '7TQyo_k4m7_boBRTT8viSXuLix0',
});

const router = express.Router();

router.get("/", async (req, res) => {
    console.log("Cloudinary Config:", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
          
	const courses = await Course.find();
	res.status(200).json({
		msg: "courses fetched successfully",
		error: false,
		data: courses,
	});
});

router.post("/", async (req, res) => {

	const { title, description, duration, thumbnail } = req.body;

	try {
		const uploadedImage = await cloudinary.uploader.upload(thumbnail, {
			folder: "courses",
		});

		const newCourse = new Course({
			title,
			description,
			duration,
			thumbnail: uploadedImage.secure_url,
		});

		const savedCourse = await newCourse.save();
		res.status(201).json({
			msg: "Course added successfully",
			data: savedCourse,
			error: false,
		});
	} catch (error) {
		console.error("Error Details:", error); // Log detailed error
		res.status(500).json({
			msg: "Failed to add course",
			error: error.message, // Send error message for debugging
		});
	}
});


router.put("/:id", async (req, res) => {
	const { title, description, duration, thumbnail } = req.body;
	try {
		const updatedCourse = await Course.findByIdAndUpdate(
			req.params.id,
			{ title, description, duration, thumbnail },
			{ new: true } // To return the updated course data
		);
		res.status(200).json({
			msg: "Course updated successfully",
			data: updatedCourse,
			error: false,
		});
	} catch (error) {
		console.error("Error updating course:", error);
		res.status(500).json({
			msg: "Failed to update course",
			error: true,
		});
	}
});


// Delete course
router.delete("/:id", async (req, res) => {
	try {
		await Course.findByIdAndDelete(req.params.id);
		res.status(200).json({
			msg: "Course deleted successfully",
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




