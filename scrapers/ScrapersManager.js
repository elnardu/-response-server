const TwitterScraper = require('./TwitterScraper'),
  SlackScraper = require('./SlackScraper')


class ScrapersManager {
  constructor(settings) {

    this.twitterScraper = new TwitterScraper(settings)
    this.slackScraper = new SlackScraper(settings)
  }

  run() {
    this.twitterScraper.run()
    this.slackScraper.run()

  }
}

module.exports = ScrapersManager;
