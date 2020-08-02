const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator')

const erroHandler = require('../util/error-handler')

const Product = require('../models/product')
const User = require('../models/user')

const clearImage = filePath => {
	filePath = path.join(__dirname, '..', filePath)
	fs.unlink(filePath, err => console.log(err))
}

const clearGcode = filePath => {
	filePath = path.join(__dirname, '..', filePath)
	fs.unlink(filePath, err => console.log(err))
}

exports.getProducts = async (req, res, next) => {
	const public = req.query.public
	const currentPage = req.query.page || 1
	const perPage = 6
	try {
		const totalItems = await Product.find({ creator: req.userId }).countDocuments()
		const products = await Product.find({ creator: req.userId })
			.populate('creator')
			.sort({ createdAt: -1 })
			.skip((currentPage - 1) * perPage)
			.limit(perPage)

		res.status(200).json({
			message: 'Fetched Products Successfully',
			products,
			totalItems,
		})
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.getPublicProducts = async (req, res, next) => {
	const products = await Product.find({ public: true }).select('-creator')

	res.status(200).json({
		message: 'Fetched Products Successfully',
		products,
	})
}

exports.getProduct = async (req, res, next) => {
	const productId = req.params.productId
	try {
		const product = await Product.findById(productId).populate('creator')
		if (!product) {
			erroHandler('Product not found!', 404)
		}

		// Authorization Mechanism
		if (product.creator._id.toString() !== req.userId.toString()) {
			erroHandler('UnAuthorized!', 403)
		}

		res.status(200).json({
			message: 'Product Fetched',
			product,
		})
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.createProduct = async (req, res, next) => {
	const errors = validationResult(req)
	try {
		if (!errors.isEmpty()) {
			erroHandler('Validation Failed Invalid Input data!', 422)
		}

		if (!req.files.image) {
			erroHandler('No Image Provided!', 422)
		} else if (!req.files.gcode) {
			erroHandler('No Gcode File Provided!', 422)
		}

		const title = req.body.title
		const description = req.body.description
		const imageUrl = req.files.image[0].path.replace('\\', '/')
		const gcodeUrl = req.files.gcode[0].path.replace('\\', '/')
		const product = new Product({
			title,
			description,
			imageUrl,
			gcodeUrl,
			creator: req.userId,
		})

		await product.save()
		const user = await User.findById(req.userId)
		user.products.push(product) // product id only
		await user.save()

		res.status(201).json({
			message: 'Product Created Successfully',
			product,
		})
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.updateProduct = async (req, res, next) => {
	const productId = req.params.productId
	const errors = validationResult(req)
	try {
		if (!errors.isEmpty()) erroHandler('Validation Failed, Invalid Input Data!', 422)

		const title = req.body.title
		const description = req.body.description
		let imageUrl = req.body.image
		let gcodeUrl = req.body.gcode

		if (req.files.image) imageUrl = req.files.image[0].path
		if (req.files.gcode) gcodeUrl = req.files.gcode[0].path

		const product = await Product.findById(productId).populate('creator')

		// Requesting an Empty Resource
		if (!product) erroHandler('Product Not Found!', 404)

		// Authorization Mechanism
		if (product.creator._id.toString() !== req.userId.toString()) {
			erroHandler('UnAuthorized!', 403)
		}

		// Delete the old image file
		if (imageUrl && imageUrl !== product.imageUrl) clearImage(product.imageUrl)
		// Delete the old gcode file
		if (gcodeUrl && gcodeUrl !== product.gcodeUrl) clearGcode(product.gcodeUrl)

		product.title = title
		product.description = description
		if (imageUrl) product.imageUrl = imageUrl
		if (gcodeUrl) product.gcodeUrl = gcodeUrl
		const result = await product.save()

		res.status(200).json({ message: 'Product updated!', product: result })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.deleteProduct = async (req, res, next) => {
	const productId = req.params.productId
	try {
		const product = await Product.findById(productId)
		if (!product) erroHandler('Product not found!', 404)

		// Authorization Mechanism
		if (product.creator.toString() !== req.userId.toString())
			erroHandler('UnAuthorized', 403)

		// Delete the image and gcode file
		clearImage(product.imageUrl)
		clearGcode(product.gcodeUrl)

		// Delete the Product
		await Product.findByIdAndRemove(productId)

		// Delete the product id from the user collection
		const user = await User.findById(req.userId)
		user.products.pull(productId)
		await user.save()

		res.status(200).json({ message: 'Product Deleted Successfully' })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}
