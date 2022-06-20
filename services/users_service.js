const {User} = require('../models/users')
const bcrypt = require('bcryptjs');

const getUserByEmail = async (userData) => {
    return User.findOne({email: userData.email})
}

const addUser = async (userData) => {
    const password = userData.password
    const hashedPassword = await bcrypt.hash(password, 10)
    const user =
    await User.create({
        ...userData,
        password: hashedPassword,
    });
    return user;
}

const updateToken = async (_id, token ) => {
    return User.findByIdAndUpdate(_id, {token} );
}

const deleteToken = async (_id, token) => {
    return User.findByIdAndUpdate(_id, token);
}

const updateSub = async(_id, subscription) => {
    return User.findByIdAndUpdate(_id, {subscription} )
}

module.exports = {
    getUserByEmail,
    addUser,
    updateToken,
    deleteToken,
    updateSub,
}