const axios = require('axios'),
  Data = require('../models/Data'),
  querystring = require('querystring')

class SlackScraper {
  constructor(settings) {
    this.settings = settings
  }
  run() {
    axios.post('https://slack.com/api/conversations.list', querystring.stringify({token: process.env.SLACK_TOKEN})).then((res) => {
      res.data.channels.forEach((channel) => {
        axios.post('https://slack.com/api/conversations.history', querystring.stringify({token: process.env.SLACK_TOKEN, channel: channel.id})).then((res) => {
          res.data.messages.forEach((message) => {
            if (message.ts < this.settings.startDate) return
            if (message.subtype) return

            let messageData = {
              text: message.text,
              time: new Date(message.ts * 1000),
              postId: message.ts + message.user,
              source: 'slack'
            }

            new Data(messageData).save()
            .catch((e) => {

            })
          })
        })
      })
    })
  }
}

module.exports = SlackScraper
