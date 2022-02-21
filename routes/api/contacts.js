const express = require('express')
const router = express.Router()
const { NotFound, BadRequest } = require("http-errors");
// const Joi = require("joi")

const {Contact, joiShema} = require("../../models/contacts");
// const contactsOperation = require("../../models/contacts");

// const joiShema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().required(),
//   phone: Joi.string().required(),
// })

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts)
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
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

router.post('/', async (req, res, next) => {
  try {
    const { error } = joiShema.validate(req.body);
    if (error) {
      throw new BadRequest("missing required name field");
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
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

router.put('/:contactId', async (req, res, next) => {
  try {
    // const { error } = joiShema.validate(req.body);
    // if (error) {
    //   throw new BadRequest("message: missing fields");
    // }
    const { contactId } = req.params;
    const updatrContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body, 
      {
        new: true,
      }
    );
    res.json(updatrContact);
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite = false } = req.body;
    const updatrContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {new: true}
    );
    res.json(updatrContact);
  } catch (error) {
    next(error)
  }
})


module.exports = router
