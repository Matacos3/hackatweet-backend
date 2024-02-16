const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content : {type: String, required: true},
  createdDate: {type: Date, default: Date.now},
  hashtag: [{ type: String }],
  isLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  isActive: {type: Boolean, default: true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;