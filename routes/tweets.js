var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweet');
const User = require('../models/users');

//POST create tweet
router.post('/create', (req, res) => {

  User.findOne({ token: req.body.token }).then(data => {
    console.log(data)
    const author = data.id
    const content = req.body.content;
    const hashtags = extractHashtags(content);

    const newTweet = new Tweet({
      content: content,
      hashtag: hashtags,
      author: author
    })

      newTweet.save().then(() => {
        Tweet.find().then(data => {
          res.json({ yourTweet: newTweet });
        })
      });
    
})


  
});

function extractHashtags(content) {
  const regex = /#(\w+)/g;
  const matches = content.match(regex);
  if (matches) {
    return matches.map(match => match.substring(1));
  } else {
    return [];
  }
}

// GET tweets
router.get('/', (req, res) => {
    Tweet.find({isActive:true})
    .populate('author')
    .populate("isLiked")
    .then(data => {
      res.json({ tweets: data });
    })
  });


// GET tweets by Hashtags
router.get('/hashtag/:hashtagId', (req, res) => {
  Tweet.find({ hashtag: req.params.hashtagId }).then(data => {
    if (data.length > 0) {
      res.json({ result: true, total: data.length, tweets: data });
    } else {
      res.json({ result: false, error: `No tweets matching with #${req.params.hashtagId}` });
    }
  });
});

// PUT tweet (update isActive value to false, to hide/trash tweet from last tweet list)
router.put("/isActive/:tweetId", (req, res) => {
  Tweet.updateOne(
    { _id: req.params.tweetId},
    { isActive: false }
  ).then(() => {
    Tweet.find({isActive : false}).then(data => {
      res.json({ Tweet: data });
    })
  })
});

// PUT tweet (add or remove like)
router.put('/like/:tweetId', async (req, res) => {

  const userinfos = await User.findOne({ token: req.body.token })
  console.log(userinfos)
  const userId = userinfos.id;
  const tweetId = req.params.tweetId;
  let updatedTweet;
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return res.status(404).json({ message: 'Tweet not found' });
  }

  const index = tweet.isLiked.indexOf(userId);
  if (index === -1) {
    tweet.isLiked.push(userId);
  } else {
    tweet.isLiked.splice(index, 1);
  }

  updatedTweet = await tweet.save();
  res.json(updatedTweet);
});


module.exports = router;