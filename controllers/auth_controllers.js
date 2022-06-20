const users = require('../services/users_service')
const { createError } = require('../errors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SECRET_KEY} = process.env;


const registerUser = async (req, res, next) => {

    try{
        const user = await users.getUserByEmail(req.body);
        if(user){
            throw createError(409, 'Email in use')
        }

        const result = await users.addUser(req.body)
        
        res.status(201).json({
            user: {
            email: result.email,
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

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    updateSubscription,
}