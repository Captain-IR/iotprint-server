const express = require('express')
const { body } = require('express-validator')

const productController = require('../controllers/product')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

// GET /api/products
router.get('/products', isAuth, productController.getProducts)

// GET /api/products/public
router.get('/products/public', productController.getPublicProducts)

// GET /api/product/:productId
router.get('/product/:productId', isAuth, productController.getProduct)

// POST /api/product/create
router.post(
	'/product/create',
	isAuth,
	[
		body('title').trim().isLength({ min: 3 }),
		body('description').trim().isLength({ min: 5 }),
	],
	productController.createProduct
)

// PUT /api/product/:productId
router.put(
	'/product/:productId',
	isAuth,
	[
		body('title').trim().isLength({ min: 3 }),
		body('description').trim().isLength({ min: 5 }),
	],
	productController.updateProduct
)

// DELETE /api/product/:productId
router.delete('/product/:productId', isAuth, productController.deleteProduct)

module.exports = router
