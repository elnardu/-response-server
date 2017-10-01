const Twitter = require('twitter'),
  Data = require('../models/Data')

class TwitterScraper {
  constructor(settings) {
    this.settings = settings
    this.client = new Twitter({consumer_key: process.env.TWITTER_CONSUMER_KEY, consumer_secret: process.env.TWITTER_CONSUMER_SECRET, access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY, access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET})
  }
  run() {
    console.log("TWITTER SCRAPER STARTED")
    let promises = []
    this.settings.keywords.forEach((e) => {
      promises.push(new Promise((resolve, reject) => {
        this.client.get('search/tweets', {
          q: e,
          result_type: 'recent',
          count: '100'
        }, function(error, tweets, response) {
          resolve(tweets)
        })
      }))
    })

    Promise.all(promises).then((data) => {
      data.forEach(tweets => {
        tweets.statuses.forEach(tweet => {
          if (+ (new Date(tweet.created_at)) < this.settings.startDate)
            return
            // console.log(tweet)
          let tweetData = {}
          tweetData.text = tweet.text
          tweetData.time = new Date(tweet.created_at)
          tweetData.source = 'twitter'
          tweetData.postId = tweet.id_str
          tweetData.link = 'https://twitter.com/statuses/' + tweet.id_str

          if (tweet.extended_entities) {
            tweetData.imageurl = tweet.extended_entities.media[0].media_url
          }

          new Data(tweetData).save().catch(err => {
            // console.log(err)
          })
        })
      })
    })
  }
}

module.exports = TwitterScraper
