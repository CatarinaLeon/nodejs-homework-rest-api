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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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

