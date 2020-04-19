require('../boringConfig/mongooseInit')
const mongoose = require('mongoose')

const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: [3,' is too short- Must contain at least 3 characters'],
        unique: true,
        required: [true, "is required"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "is required"],
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error(' is not a valid email')
        }
    },
    password: {
        type: String,
        required: [true, " is required"],
        minlength: [6,' is too short- Must contain at least 6 characters'],
        trim: true
    },
    rating: {
        type: Number,
        default: process.env.INITIAL_RATING,
        required: true
    },
    codeToConfirm: {
        type: String,
        required: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isNewGameRequested: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
})

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue)[0]
        next(new Error(`That ${duplicateKey} is already exists in our system`));
    } else {
        next(error);
    }
  });

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.isNowOnGamePage

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async(usernameOrMail, password) => {
    let user = await User.findOne({ email: usernameOrMail })
    if (!user)
        user = await User.findOne({ username: usernameOrMail })

    if (!user)
        throw new Error('There is no email or user in our system named: ' + usernameOrMail)

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
        throw new Error('Wrong password')

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)

    next()
})


const User = mongoose.model('User', userSchema)
module.exports = User