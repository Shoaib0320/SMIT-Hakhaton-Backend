import mongoose from "mongoose";
const { Schema } = mongoose;
const courseSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		duration: { type: String, required: true },
		thumbnail: { type: String, required: true },
	},
	{ timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
