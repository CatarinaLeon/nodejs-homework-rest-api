const express = require("express")
const {NotFound, Conflict, BadRequest, Unauthorized } = require("http-errors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid");

const {joiRegisterSchema, joiLoginShema, joiUpdateSchema, User} = require("../../models/users")
const { authenticate} = require("../../middlewares")

const sendEmail = require("../../helpers/sendEmail");

const router = express.Router()
const { SECRET_KEY, SITE_NAME } = process.env;

router.post("/signup", async (req, res, next) => {
    try {
        const { error } = joiRegisterSchema.validate(req.body)
        if (error) {
            throw new BadRequest(error.message)
        }
        const { email, password, subscription } = req.body
        const user = await User.findOne({ email })
        if (user) {
            throw new Conflict('Email in use')
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const verificationToken = uuidv4();
        const newUser = await User.create({ email, subscription, password: hashPassword, verificationToken})

        const data = {
            to: email,
            subject: "Подтверждение email",
            text: `<a target="_blank" href="${SITE_NAME}/user/verify/${verificationToken}">Подтвердить email</a>`,
            html: `<a target="_blank" href="${SITE_NAME}/user/verify/${verificationToken}">Подтвердить email</a>`,
        };
        await sendEmail(data);
        res.status(201).json({
            user: { email: newUser.email, subscription: newUser.subscription }
        });
    } catch (error) {
        next(error)
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { error } = joiLoginShema.validate(req.body)
        if (error) {
            throw new BadRequest(error.message)
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Unauthorized("Email or password is wrong")
        }
        if (!user.verify) {
        throw new Unauthorized("Email not verify");
    }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            throw new Unauthorized("Email or password is wrong");
        }
        const { subscription, _id } = user;
        const payload = { id: _id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

        await User.findByIdAndUpdate(_id, { token });

        res.json({
            token,
            user: {
                email, subscription
            },
        });
    } catch (error) {
        next(error);
    }
});

router.get("/current", authenticate, (req, res, next) => {
    const { email, subscription } = req.user
    res.json({
        user: {
            email,
            subscription,
        },
    })
});

router.get("/logout", authenticate, async (req, res) => {
    const _id = req.user
    await User.findByIdAndUpdate(_id, { token: null })
    res.status(204).send()
});

router.patch("/", authenticate, async (req, res, next) => {
    try {
        const { error } = joiUpdateSchema.validate(req.body)
        if (error) {
            throw new BadRequest(error.message)
        }
        const { _id } = req.user
        const { subscription } = req.body
        const updateContact = await User.findByIdAndUpdate(
            _id, { subscription }, { new: true }
        )
        res.json(updateContact)
    } catch (error) {
        next(error)
    }
});

router.get("/verify/:verificationToken", async (req, res, next) => {
try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw new NotFound("User not found");
    }
    await User.findOneAndUpdate(user._id, {
        verificationToken: null,
        verify: true,
    });
    res.json({
        message: "Verification successful",
    });
    } catch (error) {
    next(error);
    }
});

router.post("/verify", async (req, res, next) => {
try {
    const { email } = req.body;
    if (!email) {
        throw new BadRequest("missing required field email");
    }
    const user = User.findOne({ email });
    if (!user) {
        throw new NotFound("User not found");
    }
    if (user.verify) {
        throw new BadRequest("Verification has already been passed");
    }
    const { verificationToken } = user;
    const data = {
        to: email,
        subject: "Подтверждение email",
        text: `<a target="_blank" href="${SITE_NAME}/user/verify/${verificationToken}">Подтвердить email</a>`,
        html: `<a target="_blank" href="${SITE_NAME}/user/verify/${verificationToken}">Подтвердить email</a>`,
    };

    await sendEmail(data);
    res.json({ message: "Verification email sent" });
    } catch (error) {
    next(error);
    }
});

module.exports = router;