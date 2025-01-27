import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { connectDB } from './config/db.js';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(express.json());

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

// Connect to DB
connectDB();

// Routes
app.use('/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
