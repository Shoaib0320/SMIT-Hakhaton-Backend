// Import Express
// Import Express
import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import usersRoutes from "./routers/userRoute.js";
import courseRoutes from "./routers/courseRoute.js";
import { connectDB } from "./lib/DB/connectDB.js";

const app = express(); // Express App Create Karo
const PORT = 1222; // Port Define Karo

// Load environment variables from .env.local
dotenv.config(); // Load .env variables

// Middleware (JSON Data Handle Karne Ke Liye)
app.use(express.json());

// Connect to the database
connectDB();

app.use(
	cors({
	  origin: [
		"http://localhost:5173",  // Allow localhost for development
		"https://smit-hakhaton-frontend.vercel.app",  // Allow Vercel URL for production
	  ], // Allow these specific frontend addresses
	  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
	  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
	  credentials: true,              // Allows cookies to be sent
	})
  );
  

// Routes Api
app.use("/users", usersRoutes);
app.use("/courses",courseRoutes)

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js Backend!');
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
