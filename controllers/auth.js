const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const errorHandler = require('../util/error-handler')

const transporter = require('../util/emailService')

const User = require('../models/user')
const Blacklist = require('../models/blacklist')

exports.signup = async (req, res, next) => {
	const errors = validationResult(req)
	const email = req.body.email
	const username = req.body.username
	const password = req.body.password

	try {
		if (!errors.isEmpty()) {
			errorHandler('Validation failed!', 422, errors.array())
		}

		const hashedPw = await bcrypt.hash(password, 12)
		const user = new User({
			email,
			password: hashedPw,
			username,
		})
		await user.save()

		const emailConstruct = {
			from: process.env.EMAIL_SENDER,
			to: email,
			subject: 'SignUp Successful',
			html:
				'<h1>Welcome to IoTprint please login to start using our service and print your models remotely</h1>',
		}
		transporter.sendMail(emailConstruct, function (err, res) {
			if (err) console.log(err)
			console.log(res)
		})

		res.status(201).json({ message: 'Account Created, Please now login' })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.login = async (req, res, next) => {
	const email = req.body.email
	const password = req.body.password
	try {
		const user = await User.findOne({ email: email })
		if (!user) {
			errorHandler('Invalid Email or Password!', 400)
		}

		const isEqual = await bcrypt.compare(password, user.password)
		if (!isEqual) {
			errorHandler('Invalid Email or Password!', 400)
		}

		const token = jwt.sign({ userId: user._id.toString() }, 'secret', { expiresIn: '6h' })

		res.status(200).json({ message: 'Login Successful', token })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.me = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId).select('email')
		if (!user) {
			errorHandler('User not found', 404)
		}
		res.status(200).json({ user })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.logout = async (req, res, next) => {
	const authHeader = req.get('Authorization')
	try {
		const token = new Blacklist({
			token: authHeader.split(' ')[1],
		})

		await token.save()
		res.status(200).json({ message: 'Logged Out Successfully' })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}
