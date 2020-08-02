// In this file you can configure migrate-mongo

const { MONGODB_URI } = require('../config')

const config = {
	mongodb: {
		url: MONGODB_URI,

		databaseName: '',

		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},

	migrationsDir: 'migrations',
	changelogCollectionName: 'changelog',
	migrationFileExtension: '.js',
}

module.exports = config
