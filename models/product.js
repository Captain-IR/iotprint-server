const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		stlUrl: {
			type: String,
			required: true,
		},
		public: {
			type: Boolean,
			default: false
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
