const {Schema, model} = require('mongoose')
const Joi = require('joi');

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
})

const schemaCreate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
})

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.bool().required()
})



const Contact = model("contact", schema)

module.exports = {
  Contact,
  schemaCreate,
  schemaUpdateContact,
  schemaUpdateFavorite

}























