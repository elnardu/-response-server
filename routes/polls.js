const express = require('express'),
  Data = require('../models/Data'),
  Poll = require('../models/Poll'),
  uuid = require('uuid/v1'),
  mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId

const router = new express.Router()

router.post('/vote', (req, res) => {
  // console.log(req.params)
  console.log(req.body)

  if (!req.body.tag || !req.body.sentiment || !req.body.pollId) res.send()

  new Data({
    source: "vote",
    isAnalysed: true,
    sentiment: req.body.sentiment,
    keywords: [req.body.tag],
    time: Date.now(),
    postId: uuid(),
    pollId: ObjectId(req.body.pollId)
  }).save()

  res.send()
})

router.get('/list', (req, res) => {
  Poll.find({}).then(polls => {
    res.json(polls)
  })
})

router.post('/info', (req, res) => {
  let id = req.body.id
  Poll.findById(id).then(poll => {
    let obj = poll.toObject()
    promises = []
    promises.push(Data.find({source: "vote", sentiment: 1, pollId: ObjectId(id)}).count().then(c => obj.goodCount = c))
    promises.push(Data.find({source: "vote", sentiment: 0, pollId: ObjectId(id)}).count().then(c => obj.badCount = c))
    Promise.all(promises).then(() => {
      res.json(obj)
    })
  })
})

router.post('/create', (req, res) => {
  console.log(req.body)
  if (!req.body.question || !req.body.goodAnswer || !req.body.badAnswer || !req.body.tag) return
  new Poll({
    question: req.body.question,
    goodAnswer: req.body.goodAnswer,
    badAnswer: req.body.badAnswer,
    tag: req.body.tag
  }).save().then(poll => {
    console.log(poll._id)
    res.send(poll._id)
  })
})

module.exports = router
