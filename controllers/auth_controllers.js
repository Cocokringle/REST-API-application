const users = require('../services/users_service')
const { createError } = require('../errors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SECRET_KEY} = process.env;
const gravatar = require('gravatar')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')


const registerUser = async (req, res, next) => {

    try{
        const {email} = req.body
        const user = await users.getUserByEmail(req.body);
        if(user){
            throw createError(409, 'Email in use')
        }
        const avatarURL = gravatar.url(email)
        const result = await users.addUser(req.body, avatarURL)
    
        res.status(201).json({
            user: {
            email: result.email,
            avatarURL: avatarURL,
            subscription: result.subscription,
            }
        })

        return result;
        
    } catch (e) {
        next(e)
    }
}

const loginUser = async (req, res, next) => {
    try{
        const user = await users.getUserByEmail(req.body);
        if(!user){
            throw createError(401, 'Email or password is wrong')
        }
        const { password } = req.body
        const passCompare = await bcrypt.compare(password, user.password)
        if(!passCompare){
            throw createError(401, 'Email or password is wrong')
        }

        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"})
        await users.updateToken(user._id, token)
        await 

        res.status(200).json({
            token: token,
            user: {
            email: user.email,
            subscription: user.subscription,
            }
        })

    } catch (e) {
        next(e)
    }

}
const logoutUser = async (req, res, next) => {
    const {_id} = req.user;
    await users.deleteToken(_id, {token: null})
    res.status(204).json()

}
const getCurrentUser = async (req, res, next) =>{
    const {email, subscription } = req.user
    res.status(200).json({
        user: {
        email: email,
        subscription: subscription,
        }
    })
}

const updateSubscription = async (req, res, next) => {
try{
    const { _id, email } = req.user
    const { subscription } = req.body
    const user = await users.updateSub(_id, subscription)
    if(!user) {
        throw createError(400, "missing field subscription");
    } else {
        res.status(200).json({
            user: {
            email: email,
            subscription: subscription,
            }
        })
    }
} catch (e) {
    next(e)
}
}

const updateAvatar = async (req, res, next) => {
    const avatarsDir = path.join(__dirname, "../", "public", "avatars")
    const { path: tempUpload, originalname } = req.file;
    const {_id: id} = req.user;
    const imageName =  `${id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, imageName)

    try {
        await fs.rename(tempUpload, resultUpload)
        Jimp.read(resultUpload)
        .then(file => {
          return file
            .resize(250, 250)
            .write(resultUpload)
        })
        .catch(err => {
          console.error(err)
        })
        const avatarURL = path.join("/", imageName)
        const { _id } = req.user
        await users.updateAvatar(_id, avatarURL)
        res.status(200).json({avatarURL})
    } catch (error) {
        await fs.unlink(tempUpload)
        next(error)
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    updateSubscription,
    updateAvatar,
}