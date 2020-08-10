const express = require('express')
const { body } = require('express-validator')

const jobController = require('../controllers/job')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

// GET /api/job/create
router.post('/job/create', isAuth, jobController.createJob)

// // GET /api/jobs
router.get('/jobs', isAuth, jobController.getJobs)

// // GET /api/job
router.get('/job', jobController.getJob)

// // PUT /api/job/:jobId
router.put('/job/:jobId', jobController.updateJob)

// // DELETE /api/job/:jobId
router.delete('/job/:jobId', isAuth, jobController.deleteJob)

module.exports = router
