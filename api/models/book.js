// Require the mongoose library
const mongoose = require("mongoose");

// Define the note's database schema
const bookSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        genres: {
            type: [String],
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        rating: {
            type: Number,
            required: false,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // add the favoriteCount property
        recommendCount: {
            type: Number,
            default: 0
        },
        // add the favoritedBy property
        recommendBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]

        
    },
    {
        // Assigns createdAt and updatedAt fields with a Date type
        timestamps: true
    }
);

// Define the 'Note' model with the schema
const Book = mongoose.model("Book", bookSchema);

// Export the module
module.exports = Book;
