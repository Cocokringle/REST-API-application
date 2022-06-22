const {User} = require('../models/users')
const bcrypt = require('bcryptjs');

const getUserByEmail = async (userData) => {
    return User.findOne({email: userData.email})
}

const addUser = async (userData, avatarURL) => {
    const password = userData.password
    const hashedPassword = await bcrypt.hash(password, 10)
    const user =
    await User.create({
        ...userData,
        avatarURL: avatarURL,
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

const updateAvatar = async(_id, avatarURL) => {
    return User.findByIdAndUpdate(_id, {avatarURL})
}
module.exports = {
    getUserByEmail,
    addUser,
    updateToken,
    deleteToken,
    updateSub,
    updateAvatar,
}