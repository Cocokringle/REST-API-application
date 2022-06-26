const express = require('express')
const router = express.Router()
const validation = require('../../middleware/validation')
const checkToken = require('../../middleware/checkToken')
const upload = require('../../middleware/upload')
const {schemaRegister, schemaLogin, schemaUpdateSub} = require('../../models/users')
const {registerUser, 
    loginUser, 
    getCurrentUser, 
    logoutUser, 
    updateSubscription, 
    updateAvatar,
    verifyEmail,
    resendEmail} = require('../../controllers/auth_controllers')

router.post('/signup', validation(schemaRegister), registerUser)

router.post('/login', validation(schemaLogin), loginUser)

router.get('/logout', checkToken, logoutUser)

router.get('/current', checkToken, getCurrentUser)

router.patch('/', checkToken, validation(schemaUpdateSub), updateSubscription)

router.patch('/avatars', checkToken, upload.single("avatar"), updateAvatar)

router.get('/verify/:verificationToken', verifyEmail)

router.post('/verify', resendEmail)

module.exports = router