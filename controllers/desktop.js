const fs = require('fs')
const path = require('path')

const errorHandler = require('../util/error-handler')

const Product = require('../models/product')

exports.getFile = async (req, res, next) => {
	const productId = req.params.productId
	try {
		const product = await Product.findById(productId)

		// Resource not found
		console.log(product)
		if (!product) errorHandler('Product Not Found', 404)

		const readerStream = fs.createReadStream(path.join(__dirname, '..', product.stlUrl))
		res.set('Content-Type', 'application/octet-stream')
		res.set('Content-Disposition', `attachment; filename="${product.title}.stl"`)

		readerStream.pipe(res)
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
			next(err)
		}
	}
}

exports.checkConnectivity = (req, res, next) => {
	res.status(200).json({ message: 'Online' })
}
