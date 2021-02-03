// import express module
const router = require('express').Router()

//import controller
const { userController } = require('../controllers')

//import express-validator
const { body } = require('express-validator')

// import helpers
const { verifyToken } = require('../helpers/jwt')

// register validation
const registerValidation = [
    body('username')
        .notEmpty()
        .withMessage('username can\'t empty')
        .isLength({ min : 6 })
        .withMessage('username min. 6 character'),
    body('password')
        .notEmpty()
        .withMessage('password can\'t empty')
        .matches(/[0-9]/)
        .withMessage('password must include numbers')
        .matches(/[!@#$%^&*]/)
        .withMessage('password must include symbol'),
    body('email')
        .isEmail()
        .withMessage('invalid email')
]

router.post('/register', registerValidation, userController.register)
router.post('/login', userController.login)
router.patch('/deactive', verifyToken, userController.deactive)
router.patch('/activate', verifyToken, userController.activate)
router.patch('/closed', verifyToken, userController.closed)

module.exports = router