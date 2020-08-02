const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blacklistSchema = new Schema({
	token: {
		type: String,
		required: true,
	},
})

module.exports = mongoose.model('Blacklist', blacklistSchema)
