import Category from "../models/Category.js"

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({})
  res.json(categories)
}

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error("Category not found")
  }
}

// @desc    Create a category
// @route   POST /categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, subcategories, maxLoan, loanPeriod } = req.body

  console.log('Request Body', req.body);
  
  try {
    const category = new Category({
        name,
        subcategories,
        maxLoan,
        loanPeriod,
      })
    
      const createdCategory = await category.save()
      res.status(201).json(createdCategory)

  } catch (err) {
    console.log('Error', err);
    res.status(500).json({ error: err.message })
  }
}

// @desc    Update a category
// @route   PUT /categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const { name, subcategories, maxLoan, loanPeriod } = req.body

  const category = await Category.findById(req.params.id)

  if (category) {
    category.name = name
    category.subcategories = subcategories
    category.maxLoan = maxLoan
    category.loanPeriod = loanPeriod

    const updatedCategory = await category.save()
    res.json(updatedCategory)
  } else {
    res.status(404)
    throw new Error("Category not found")
  }
}

// @desc    Delete a category
// @route   DELETE /category/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    await category.deleteOne()
    res.json({ message: "Category Deleted" })
  } else {
    res.status(404)
    throw new Error("Category not found")
  }
}

export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory }

