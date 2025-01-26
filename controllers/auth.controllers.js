import { comaprePassword, convertPasswordToHash, generateRandomPassword, generateToken,sendResetPasswordEmail } from "../lib/utility.js";
import UserModal from "../models/user.models.js";
import jwt from "jsonwebtoken"

export async function SignUpNewUser(req, res) {
  try {
    // Check if user already exists
    const ifUserExists = await UserModal.findOne({ email: req.body.email });
    if (ifUserExists) {
      return res.status(400).send({
        message: "User already exists",
        error: true,
      });
    }

    let password;
    if (req.body.role === "admin") {
      // Admin role must provide password
      if (!req.body.password) {
        return res.status(400).send({
          message: "Password is required for admin accounts",
          error: true,
        });
      }
      password = req.body.password;
    } else if (req.body.role === "user") {
      // Generate password for user role
      password = generateRandomPassword(12); // Generate a random 12-character password
    } else {
      return res.status(400).send({
        message: "Invalid role. Only 'admin' and 'user' are allowed",
        error: true,
      });
    }

    // Convert password to hash
    const hashedPassword = await convertPasswordToHash(password);

    // Create user object
    const userObj = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      cnic: req.body.cnic
    };

    // Save the new user to the database
    const newUser = new UserModal(userObj);
    await newUser.save();

    // Generate token
    const token = await generateToken({ email: req.body.email, role: req.body.role });

    // If role is user, send a reset password email
    if (req.body.role === "user") {
      await sendResetPasswordEmail(req.body.email, password); // Sends reset link and the auto-generated password
    }

    // Exclude password from the response
    delete userObj.password;

    res.status(201).json({
      message: "User created successfully",
      error: false,
      data: userObj,
      token,
    });
  } catch (e) {
    console.error("Error in SignUpNewUser:", e.message);
    res.status(500).send({
      error: true,
      message: e.message,
    });
  }
}

export async function getAllUsers(req, res) {
    try {
        let finding = await UserModal.find()
        res.status(200).send({
            message: "All Users Fetched Successfully",
            error: false,
            data: finding
        })
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.message
        })
    }
}

export async function LoginNewUser(req, res) {
    try {
        let user = await UserModal.findOne({ email: req.body.email });

        if (!user) {
            return res.send({
                message: "User Not Found",
                error: true
            });
        }

        let isPasswordCorrect = await comaprePassword(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.send({
                message: "Password Not Matched",
                error: true
            });
        }

        console.log(isPasswordCorrect);
        console.log(user, "user");

        let generatingToken = await jwt.sign(
            { id: user._id, email: user.email , role: user.role}, 
            process.env.JWT_PASSWORD_SECRET_KEY,
            { expiresIn: '60d' }
        );
        console.log(generatingToken, "token");

        res.send({
            message: "Good",
            token: generatingToken 
        });
    } catch (e) {
        console.error(e); 
        res.send({
            message: "error"
        });
    }
}
