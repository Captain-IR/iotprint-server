const express = require('express')

const fileController = require('../controllers/file')

const router = express.Router()

router.get('/download/:productId', fileController.getFile)

module.exports = router
