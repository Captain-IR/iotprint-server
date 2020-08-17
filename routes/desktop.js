const express = require('express')

const desktopController = require('../controllers/desktop')

const router = express.Router()

router.get('/', desktopController.checkConnectivity)

router.get('/:productId', desktopController.getFile)

module.exports = router
