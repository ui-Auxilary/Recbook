const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ForbiddenError, AuthenticationError} = require('apollo-server-express');

const mongoose = require("mongoose");
require('dotenv').config();

const gravatar = require("../util/gravatar");

module.exports = {
	newBook: async (parent,{ title, author, genres, description, rating },{ models, user }) => {
                if (!user) {
                        throw new AuthenticationError('Must be signed in to create new book');
                }
                
		return await models.Book.create({
			title: title,
			author: author,
			genres: genres,
			description: description,
			rating: rating,
                        uploadedBy: mongoose.Types.ObjectId(user.id)
		});
	},

	updateBook: async (parent, {id, title, author, genres, description, rating },{ models, user }) => {
		if (!user) {
			throw new AuthenticationError(
				"Must be signed in to update book"
			);
		}

		// find the note
		const book = await models.Book.findById(id);
		// if the note owner and current user don't match, throw a forbidden error
		if (book && String(book.uploadedBy) !== user.id) {
			throw new ForbiddenError(
				"You don't have permissions to update the book"
			);
		}

		return await models.Book.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: {
					title,
					author,
					genres,
					description,
					rating,
				},
			},
			{
				new: true,
			}
		);
	},

	deleteBook: async (parent,{ id },{ models, user }) => {
		if (!user) {
			throw new AuthenticationError(
				"Must be signed in to delete book"
			);
		}

		// find the note
		const book = await models.Book.findById(id);
		// if the note owner and current user don't match, throw a forbidden error
		if (book && String(book.uploadedBy) !== user.id) {
			throw new ForbiddenError(
				"You don't have permissions to delete the book"
			);
		}

		try {
			await models.Book.findOneAndRemove({ _id: id });
			return true;
		} catch (err) {
			return false;
		}
	},

        signUp: async (parent, {username, email, password}, {models}) => {
                // Standardise the email
                email = email.trim().toLowerCase();

                // Hash the password
                const hashed = await bcrypt.hash(password, 10);

                //gravatar url
                const avatar = gravatar(email);
                try {
                        const user = await models.User.create({
                                username,
                                email,
                                avatar,
                                password: hashed
                        })
                        
                        return await jwt.sign({id: user._id}, process.env.JWT_SECRET);
                } catch (err) {
                        console.log(err);
			// if there's a problem creating the account, throw an error
			throw new Error("Error creating account")
                }    
        },

        signIn: async (parent, {username, email, password}, {models}) => {
                if (email) {
                        // normalize email address
                        email = email.trim().toLowerCase();
                }

                const user = await models.User.findOne({
			$or: [{ email }, { username }],
		});

                if (!user) {
                        throw new AuthenticationError('User does not exist');
                }

                validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                        throw new AuthenticationError('Error signing in');
                } 
                
                return jwt.sign({id: user._id}, process.env.JWT_SECRET);
        },
        toggleRecommend: async (parent, {id}, {models, user}) => {
		// if no user context is passed, throw auth error
		if (!user) {
			throw new AuthenticationError();
		}

                let bookCheck = await models.Book.findById(id);
                const hasUser = bookCheck.recommendBy.indexOf(user.id); 

                if (hasUser >= 0) {
                        return await models.Book.findByIdAndUpdate(
				id,
				{
					$pull: {
						recommendBy:
							mongoose.Types.ObjectId(
								user.id
							),
					},
					$inc: {
						recommendCount: -1,
					},
				},
				{
					// Set new to true to return the updated doc
					new: true,
				}
			);                                                                                                                                                                                      
                } else {
                        // if the user doesn't exist in the list
                        // add them to the list and increment the favoriteCount by 1
                        return await models.Book.findByIdAndUpdate(
				id,
				{
					$push: {
						recommendBy:
							mongoose.Types.ObjectId(
								user.id
							),
					},
					$inc: {
						recommendCount: 1,
					},
				},
				{
					new: true,
				}
			);          
                }
        }
}