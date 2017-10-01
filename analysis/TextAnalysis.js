const axios = require('axios'),
  Data = require('../models/Data')


const msUrlKeyPhrase = 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases',
  msUrlSentiment = 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment'

const msApiKey = process.env.MS_CONGNITIVESERVICES

class TextAnalysis {
  constructor() {
  }
  run(objs) {
    let promises = []
    // console.log(obj);
    let documents = []
    objs.forEach((e) => {
      documents.push({
        language: 'en',
        id: e._id,
        text: e.text
      })
    })

    console.log(documents)

    promises.push(axios.post(msUrlKeyPhrase, {
      documents: documents
    }, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MS_CONGNITIVESERVICES
      }
    }))

    promises.push(axios.post(msUrlSentiment, {
      documents: documents
    }, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MS_CONGNITIVESERVICES
      }
    }))

    Promise.all(promises).then(res => {
      console.log(res)
      res[0].data.documents.forEach((e) => {
        Data.findById(e.id).then(data => {
          data.keywords = e.keyPhrases
          data.save()
        })
      })

      res[1].data.documents.forEach((e) => {
        Data.findById(e.id).then(data => {
          data.sentiment = e.score
          data.isAnalysed = true
          data.save()

        })
      })
      // obj.keywords = res[0].data.documents[0].keyPhrases
      // obj.sentiment = res[0].data.documents[0].score
      // obj.isAnalysed = true
      // obj.save()

    })
  }
}

module.exports = TextAnalysis
