const express = require('express')
const router = express.Router()
const { NotFound, BadRequest } = require("http-errors");

const { Contact, joiShema } = require("../../models/contacts");
const {authenticate} = require("../../middlewares")


router.get('/', authenticate, async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts)
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFound();
    }
    res.json(contact)
  } catch (error) {
    next(error)
  }
})

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error } = joiShema.validate(req.body);
    if (error) {
      throw new BadRequest("missing required name field");
    }
    const { _id } = req.user;
    const newContact = await Contact.create({...req.body, owner:_id});
    res.status(201).json(newContact);
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await Contact.findByIdAndRemove(contactId);
    if (!deleteContact) {
      throw new NotFound();
    }
    res.json("message: contact deleted");
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body, 
      {
        new: true,
      }
    );
    res.json(updateContact);
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId/favorite', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite = false } = req.body;
    const updateContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {new: true}
    );
    res.json(updateContact);
  } catch (error) {
    next(error)
  }
})


module.exports = router
