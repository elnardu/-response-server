const express = require('express'),
  Data = require('../models/Data')

var config = require("../config")

const router = new express.Router()

router.get('/totalCount', (req, res) => {
  Data.aggregate([
    {
      $group: {
        _id: '$source',
        count: {
          $sum: 1
        }
      }
    }, {
      $group: {
        _id: null,
        total: {
          $sum: '$count'
        },
        groups: {
          $push: '$$CURRENT'
        }
      }
    }
  ]).then((obj) => {
    res.json(obj)
  })
})

router.get('/latestResponces', (req, res) => {
  Data.find({isAnalysed: true}).sort({time: -1}).limit(3).then((obj) => {
    res.json(obj)
  })
})

router.get('/overallSentiment', (req, res) => {
  Data.aggregate([
    {
      $group: {
        _id: null,
        sentiment: {
          $avg: "$sentiment"
        }
      }
    }
  ]).then(obj => {
    res.json(obj[0])
  })
})

router.get('/currentSentiment', (req, res) => {
  var d = new Date()
  d.setHours(d.getHours() - 1)

  Data.aggregate([
    {
      $match: {
        time: {
          $gte: d
        }
      }
    }, {
      $group: {
        _id: null,
        sentiment: {
          $avg: "$sentiment"
        }
      }
    }
  ]).then(obj => {
    res.json(obj[0])
  })
})

router.get('/getSentimentByTime', (req, res) => {
  Data.aggregate([
    {
      $group: {
        _id: {
          day: {
            $dayOfMonth: "$time"
          },
          hour: {
            $hour: "$time"
          },
          month: {
            $month: "$time"
          },
          year: {
            $year: "$time"
          }
        },
        sentiment: {
          $avg: '$sentiment'
        }
      }

    }
  ]).then(objs => {
    let data = []
    objs.forEach(e => {
      data.push({
        time: + (new Date(e._id.year, e._id.month - 1, e._id.day, e._id.hour)),
        sentiment: e.sentiment
      })
    })

    data = data.filter(e => + e.time >= config.settings.startDate * 1000)
    res.json(data)
  })
})

router.get('/tagsStatisticsGood', (req, res) => {
  Data.aggregate([
    {
      $unwind: "$keywords"
    }, {
      $group: {
        _id: "$keywords",
        count: {
          $sum: 1
        },
        sentiment: {
          $avg: "$sentiment"
        }
      }
    }, {
      $match: {
        count: {
          $gte: 7 // TODO: change this
        }
      }
    }, {
      $sort: {
        sentiment: -1
      }
    }, {
      $limit: 10
    }
  ]).then((obj) => {
    res.json(obj)
  })
})

router.get('/tagsStatisticsBad', (req, res) => {
  Data.aggregate([
    {
      $unwind: "$keywords"
    }, {
      $group: {
        _id: "$keywords",
        count: {
          $sum: 1
        },
        sentiment: {
          $avg: "$sentiment"
        }
      }
    }, {
      $match: {
        count: {
          $gte: 2 // TODO: change this
        }
      }
    }, {
      $sort: {
        sentiment: 1
      }
    }, {
      $limit: 10
    }
  ]).then((obj) => {
    res.json(obj)
  })
})

module.exports = router
