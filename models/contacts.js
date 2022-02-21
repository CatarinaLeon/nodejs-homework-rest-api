const { Schema, model } = require("mongoose")
const Joi = require("joi")

const contactsSchema = Schema(
  {
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
  }
)

const joiShema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool,
})

const Contact = model("contacts", contactsSchema);

module.exports = { Contact, joiShema };

// const fs = require('fs/promises')
// const path = require('path');
// const { v4 } = require("uuid");

// const contactsPath = path.join(__dirname, 'contacts.json');

// const listContacts = async () => {
//   const data = await fs.readFile(contactsPath);
//   const contacts = JSON.parse(data);
//   return contacts;
// }

// const getContactById = async (contactId) => {
//   const contacts = await listContacts();
//   const contact  = contacts.find((contact) => contact.id === contactId);
//   if (!contact ) return null;
//   return contact;
// }

// const removeContact = async (contactId) => {
//   const contacts = await listContacts();
//   const idx = contacts.findIndex((contact) => contact.id === contactId)
//   if (idx === -1) return null
//   const newContacts = contacts.filter((_, index) => index !== idx);
//   await fs.writeFile(contactsPath, JSON.stringify(newContacts, null,2))
//   return contacts[idx];
// }

// const addContact = async (body) => {
//   const newContact = { id: v4(), ...body };
//   const contacts = await listContacts();
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return newContact;
// }

// const updateContact = async (contactId, body) => {
//   const contacts = await listContacts();
//   const idx = contacts.findIndex((item) => item.id === contactId);
//   if (idx === -1) {
//     return null;
//   }
//   contacts[idx] = { id: contactId, ...body };
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return contacts[idx];
// }

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// }
