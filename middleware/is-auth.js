const jwt = require('jsonwebtoken')

const errorHandler = require('../util/error-handler')

const Blacklist = require('../models/blacklist')

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization')
	if (!authHeader) {
		errorHandler('Not authenticated', 401)
	}
	const token = authHeader.split(' ')[1]
	let decodedToken

	Blacklist.findOne({ token })
		.then(revoked => {
			if (revoked) errorHandler('jwt revoked', 401)

			try {
				decodedToken = jwt.verify(token, 'secret')
			} catch (err) {
				err.statusCode = 500
				throw err
			}
			if (!decodedToken) errorHandler('Not authenticated', 401)

			req.userId = decodedToken.userId
			next()
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500
			}
			next(err)
		})
}
