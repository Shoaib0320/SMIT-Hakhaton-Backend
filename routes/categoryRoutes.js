import express from "express"
import {
  getCategories,
//   getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js"

const router = express.Router()

router.post('/', createCategory);
router.get('/', getCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// router.get('/:id', getCategoryById);

export default router

