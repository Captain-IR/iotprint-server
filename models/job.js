const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		user: {
			email: {
				type: String,
				required: true,
			},
			userId: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		},
		status: {
			type: String,
			default: 'standby'
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Job', jobSchema)
