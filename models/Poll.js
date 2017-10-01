const mongoose = require('mongoose'),
  Schema = mongoose.Schema

let PollScheme = new Schema({
  question: String,
  goodAnswer: String,
  badAnswer: String,
  tag: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Poll', PollScheme)
