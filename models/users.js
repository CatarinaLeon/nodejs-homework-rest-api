const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema(
{
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
  owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
   verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    }
    },
  avatarURL: {
      type: String,
      default: "",
    },
  },
)

const joiRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
})

const joiLoginShema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
})

const joiUpdateSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
})

const User = model("user", userSchema)

module.exports= {joiRegisterSchema, joiLoginShema, joiUpdateSchema, User}