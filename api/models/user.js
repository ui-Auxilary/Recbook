const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: { unique: true }
        },
        username: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: false
        }
    },
    {
        // Assigns createdAt and updatedAt fields with a Date type
        timestamps: true
    }
);
const User = mongoose.model('User', UserSchema);
module.exports = User;