import express from "express";
import { addCategory,deleteCategory,editCategory } from "../controllers/category.controller.js";


const CategpryRouter = express.Router();

// Add a new category
CategpryRouter.post("/", addCategory);

// Edit an existing category
CategpryRouter.put("/:id", editCategory);

// Delete a category
CategpryRouter.delete("/:id", deleteCategory);

export default CategpryRouter;
