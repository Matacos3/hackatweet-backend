var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweet');

//POST create tweet
router.post('/create', (req, res) => {
    const newTweet = new Tweet({
      content: req.body.content,
      hastag: req.body.hastag,
      author: req.body.author
    });
  
    newTweet.save().then(() => {
      Tweet.find().then(data => {
        res.json({ yourTweet: newTweet });
      })
    });
  });


// GET tweets
router.get('/', (req, res) => {
    Tweet.find().then(data => {
      res.json({ tweets: data });
    })
  });


// GET tweets by Hashtags





// PUT tweet (update isActive)
router.put("/isActive", (req, res) => {
    Tweet.updateOne (
   {tweet : req.body.id},
   {isActive: false}
).then(() => {

   Tweet.find().then(data => {
       res.json({ Tweet : data.Tweet });
})})
   });


// PUT tweet (update like)

router.put("/like", (req, res) => {

    Tweet.findOne(data.isLiked)
    .then(data => {
      if (data.isLiked.includes(req.body.id)) {
        Tweet.updateOne (
            {id : req.body.id},
            {like: {/*MODIF EN COURS*/} }
         ).then(() => {
            Tweet.find().then(data => {
                res.json({ Tweet : data.Tweet });
         })})
      } else {
        Tweet.updateOne (
            {id : req.body.id},
            {like: req.body.id}
         ).then(() => {
            Tweet.find().then(data => {
                res.json({ Tweet : data.Tweet });
         })})
            };
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });
});

module.exports = router;