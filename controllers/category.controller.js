import CategoryModal from "../models/category.model.js";

export async function addCategory(req, res) {
  try {
    const { name, subcategories } = req.body;

    // Validate request
    if (!name) {
      return res.status(400).json({ error: true, message: "Category name is required" });
    }

    // Create new category
    const newCategory = CategoryModal({
      name,
      subcategories: subcategories || [], // Default to an empty array if no subcategories are provided
    });

    await newCategory.save();

    res.status(201).json({
      error: false,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error in addCategory:", error.message);
    res.status(500).json({ error: true, message: error.message });
  }
}

/**
 * Edit an existing category or its subcategories
 */
export async function editCategory(req, res) {
  try {
    const { id } = req.params; // Category ID
    const { name, subcategories } = req.body;

    // Validate request
    if (!name && !subcategories) {
      return res.status(400).json({
        error: true,
        message: "At least one of 'name' or 'subcategories' must be provided",
      });
    }

    // Find and update category
    const updatedCategory = await CategoryModal.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(subcategories && { subcategories }) },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: true, message: "Category not found" });
    }

    res.status(200).json({
      error: false,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error in editCategory:", error.message);
    res.status(500).json({ error: true, message: error.message });
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params; // Category ID

    // Find and delete category
    const deletedCategory = await CategoryModal.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: true, message: "Category not found" });
    }

    res.status(200).json({
      error: false,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error.message);
    res.status(500).json({ error: true, message: error.message });
  }
}
