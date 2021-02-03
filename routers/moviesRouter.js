// import express module
const router = require('express').Router()

//import controller
const { moviesController } = require('../controllers')

// import helpers
const { verifyToken } = require('../helpers/jwt')

router.get('/get/all', moviesController.getAllMovies)
router.get('/get', moviesController.getMoviesByQuery)
router.post('/add', moviesController.addMovies)
router.patch('/edit/:id', verifyToken, moviesController.editStatus)
router.patch('/set/:id', verifyToken, moviesController.setSchedule)

module.exports = router