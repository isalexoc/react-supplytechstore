import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoriesModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT || 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @des     Get products by category query
// @route   GET /api/products/category
// @access  Public
const getProductByCategory = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT || 12;
  const page = Number(req.query.pageNumber) || 1;

  const category = req.query.category
    ? {
        category: {
          $regex: req.query.category,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...category });

  const products = await Product.find({ ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch all products no pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: " ",
    price: 0,
    user: req.user._id,
    brand: " ",
    category: " ",
    image: "/images/sample.jpg",
    countInStock: 100,
    numReviews: 0,
    description: " ",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    countInStock,
    video,
  } = req.body;

  if (!name || !price || !description || !brand || !category || !countInStock) {
    res.status(400);
    throw new Error("Por favor, rellena todos los campos");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.video = video;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProductImages = asyncHandler(async (req, res) => {
  const { images } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.images = images;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Producto borrado" });
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Producto ya ha sido reseñado");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Reseña añadida" });
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  // get 3 specific products by id
  const products = await Product.find({
    _id: {
      $in: [
        "6609ae5fea828bfdeb93f10d",
        "6609ae5fea828bfdeb93f088",
        "6609ae5fea828bfdeb93f10f",
      ],
    },
  });

  res.status(200).json(products);
});

// @desc    Get categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(404);
    throw new Error("Categorías no encontradas");
  }
});

// @desc    Create a category
// @route   POST /api/products/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  if (!name || !image) {
    res.status(400);
    throw new Error("Por favor, rellena todos los campos");
  }

  const category = new Category({
    name,
    image,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Delete a category
// @route   DELETE /api/products/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.status(200).json({ message: "Categoría borrada" });
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

// @desc    Update a category
// @route   PUT /api/products/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  if (!name || !image) {
    res.status(400);
    throw new Error("Por favor, rellena todos los campos");
  }

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name;
    category.image = image;

    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductImages,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getAllProducts,
  getProductByCategory,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
};
