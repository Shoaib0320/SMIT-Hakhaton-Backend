//Backend/lib/DB/connectDB.js

import mongoose from "mongoose";

export async function connectDB() {
	try {
		let connection = mongoose.connect(process.env.MONGODB_URI);
		console.info("Mongodb Connected");
	} catch (err) {
		console.log("err in connection=>", err);
	}
}
