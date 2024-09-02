const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id_card_num: {
        type: String,
        required: true,
        unique: true // Unique constraint to ensure only one account per ID card number
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    }
});

// Pre-save hook to hash password before saving
signupSchema.pre('save', async function (next) {
    try {
        // Only hash the password if it has been modified or is new
        if (!this.isModified('password')) {
            return next();
        }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Replace the plain text password with the hashed one
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare given password with the database hash
signupSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('Signup', signupSchema);
