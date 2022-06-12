const express = require('express')
const router = express.Router()
const validation = require('../../middleware/validation')
const checkToken = require('../../middleware/checkToken')
const {schemaRegister, schemaLogin, schemaUpdateSub} = require('../../models/users')
const {registerUser, loginUser, getCurrentUser, logoutUser, updateSubscription} = require('../../controllers/auth_controllers')

router.post('/signup', validation(schemaRegister), registerUser)

router.post('/login', validation(schemaLogin), loginUser)

router.get('/logout', checkToken, logoutUser)

router.get('/current', checkToken, getCurrentUser)

router.patch('/', checkToken, validation(schemaUpdateSub), updateSubscription)

module.exports = router