const express = require('express'),
  Data = require('../models/Data'),
  uuid = require('uuid/v1')

const router = new express.Router()

router.post('/vote', (req, res) => {
  // console.log(req.params)
  console.log(req.body)

  if (!req.body.tag && !req.body.sentiment) res.json({})

  new Data({
    source: "vote",
    isAnalysed: true,
    sentiment: req.body.sentiment,
    keywords: [req.body.tag],
    time: Date.now(),
    postId: uuid()
  }).save()

  res.json({})
})

module.exports = router
