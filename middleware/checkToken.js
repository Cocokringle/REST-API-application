const { createError } = require('../errors')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SECRET_KEY} = process.env;
const {User} = require('../models/users')

const checkToken = async (req, res, next) => {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ")
    try{
        if(bearer !== "Bearer"){
            return createError(401, "Not authorized")
        }
        const {id} = jwt.verify(token, SECRET_KEY)
        const user = await User.findById(id)
        if(!user || !user.token){
            return createError(401, "Not authorized")
        }
        req.user = user;
        next()
    } catch(e) {
        if(e.message === "Invalid signature"){
            e.message = 401
        }
        next(e)
    }

}

module.exports = checkToken