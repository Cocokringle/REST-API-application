const {Schema, model} = require('mongoose')
const Joi = require('joi');


const schema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },

  })

const User = model("user", schema)

const schemaRegister = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const schemaLogin = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const schemaUpdateSub = Joi.object({
    subscription: Joi.string().required(),
});

module.exports = {
  User,
  schemaRegister,
  schemaLogin,
  schemaUpdateSub,

}