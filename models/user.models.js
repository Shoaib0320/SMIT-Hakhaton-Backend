// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     cnic: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, // Auto-generated initially
//     role: { type: String, enum: ["user", "admin"], default: "user" },
//     city: { type: String },
//     country: { type: String },
//   },
//   { timestamps: true }
// );

// let UserModal = mongoose.model("user", userSchema)

// export default UserModal


// Backend: User Model (models/User.js)
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
