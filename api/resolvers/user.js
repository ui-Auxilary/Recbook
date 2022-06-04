module.exports = {
	// Resolve the list of favorites for a user when requested
	recommends: async (user, args, { models }) => {
		return await models.Book.find({ recommendBy: user._id }).sort({
			_id: -1,
		});
	},
};
