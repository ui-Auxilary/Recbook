module.exports = {
	// Resolve the author info for a note when requested
	uploadedBy: async (book, args, { models }) => {
		return await models.User.findById(book.uploadedBy);
	},
	// Resolved the favoritedBy info for a note when requested
	recommendBy: async (book, args, { models }) => {
		return await models.User.find({
			_id: { $in: book.recommendBy },
		});
	},
};
