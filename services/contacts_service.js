const { Contact } = require('../models/contacts')


const listContacts = async (_id, skip, limit, favorite) => {
  return Contact.find({owner: _id, favorite }, "", {skip, limit: Number(limit),}).populate("owner","_id email")
}

const getContactById = async (contactId) => {
    return Contact.findOne({_id: contactId})
}

const removeContact = async (contactId) => {
    return Contact.findByIdAndRemove({ _id: contactId });
}

const addContact = async (body) => {
    return Contact.create(body);
}

const updateContact = async (contactId, body ) => {
    return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
}

const updateStatusContact = async (contactId, { favorite }) => {
    return Contact.findByIdAndUpdate({ _id: contactId }, { favorite }, { new: true })
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}