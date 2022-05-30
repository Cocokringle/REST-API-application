const express = require('express')
const contacts = require('../../models/contacts')
const { createError } = require('../../errors')
const Joi = require('joi');
const router = express.Router()

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})


router.get('/', async (req, res, next) => {
  try {
  const all = await contacts.listContacts();
  res.status(200).json(all);
} catch (e) {
  next(e);
}
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log(typeof contactId)
    const contact = await contacts.getContactById(contactId);
    if(!contact) {
      throw createError(404, "Not found");
    } else{
      res.status(200).json(contact);
    }

} catch (e) {
  next(e);
}
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = schema.validate(req.body);
    if(error) {
      throw createError(400, error.message);
    } else{
      const { name, email, phone} = req.body;
      const contact = await contacts.addContact(name, email, phone);
      res.status(201).json({
        status: 'success',
        code: 201, 
        data: contact,
      });
    }

} catch (e) {
    next(e);
}
})

router.delete('/:contactId', async (req, res, next) => {
  try {
  const { contactId } = req.params;
  const contact = await contacts.removeContact(contactId);
  if(!contact) {
    throw createError(404, "Not found");
  } else{
    res.status(200).json({
        status: 'success',
        code: 200,
        message: 'contact deleted'}
    );

  }

} catch (e) {
  next(e);
}
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if(error) {
        throw createError(400, error.message);
    } 
    const { name, email, phone } = req.body;
    const { contactId } = req.params;
    const contact = await contacts.updateContact(contactId, name, email, phone);
    if(!contact) {
        throw createError(404, "Not found");
    } else{
      res.status(200).json(contact);
    }
} catch (e) {
    next(e);
}
})

module.exports = router
