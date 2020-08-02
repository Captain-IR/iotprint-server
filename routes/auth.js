const express = require('express')
const { body } = require('express-validator')

const User = require('../models/user')

const authController = require('../controllers/auth')

const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please Enter a valid email')

			.custom((value, { req }) => {
				return User.findOne({ email: value }).then(userDoc => {
					if (userDoc) {
						return Promise.reject('E-Mail address already exists!')
					}
				})
			})
			.normalizeEmail(),

		body('password').trim().isLength({ min: 5 }),
		body('username').trim().notEmpty(),
	],
	authController.signup
)

router.post('/login', authController.login)

router.get('/me', isAuth, authController.me)

router.post('/logout', authController.logout)

module.exports = router
