const express = require('express')
const router = express.Router()
const { listContacts, 
  getContactById, 
  addContact, 
  removeContact, 
  updateContact, 
  updateStatusContact } = require('../../controllers/contacts_controllers')
const validation = require('../../middleware/validation')
const checkToken = require('../../middleware/checkToken')
const { schemaCreate, schemaUpdateContact, schemaUpdateFavorite } = require('../../models/contacts')


router.get('/', checkToken, listContacts)

router.get('/:contactId', getContactById)

router.post('/', checkToken, validation(schemaCreate), addContact)

router.delete('/:contactId', removeContact)

router.put('/:contactId', validation(schemaUpdateContact), updateContact)

router.patch('/:contactId/favorite', validation(schemaUpdateFavorite), updateStatusContact)

module.exports = router
