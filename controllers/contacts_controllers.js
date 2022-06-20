const contacts = require('../services/contacts_service')
const { createError } = require('../errors')


const listContacts = async (req, res, next) => {
    try {
        const {page = 1, limit = 10, favorite = true} = req.query;
        const skip = (page - 1) * limit;
        const {_id} = req.user
        const all = await contacts.listContacts(_id, skip, limit, favorite)
        res.json(all)
      } catch (e) {
        next(e);
      }
}


const getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await contacts.getContactById(contactId);
        if(!contact) {
          throw createError(404, "Not found");
        } else{
          res.status(200).json(contact);
        }
    
    } catch (e) {
      next(e);
    }
}

const addContact = async (req, res, next) => {
    try {
        const {_id} = req.user
        const contact = await contacts.addContact({...req.body, owner: _id});
        res.status(201).json({
        status: 'success',
        code: 201, 
        data: contact,
        });
    
    } catch (e) {
        next(e);
    }
}

const removeContact = async(req, res, next) => {
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
}

const updateContact = async(req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await contacts.updateContact(contactId, req.body);
        if(!contact) {
            throw createError(404, "Not found");
        } else{
          res.status(200).json(contact);
        }
    } catch (e) {
        next(e);
    }
}

const updateStatusContact = async(req, res, next) => {
    try{
        const { contactId } = req.params;

        const contact = await contacts.updateStatusContact(contactId, req.body)
        if(!contact) {
            throw createError(400, "missing field favorite");
        } else{
        res.status(200).json(contact);
        }

    } catch(e){
        next(e)
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
}