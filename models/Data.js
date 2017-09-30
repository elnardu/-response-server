var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Data', new Schema({
  image: {
    data: Buffer,
    contentType: String
  },
  text: String,

  persons: [Schema.Types.ObjectId],
  location: {
    type: String,
    coordinates: [Number]
  },
  source: String, // name of social network

  rating: Number, // > 0 - good, < 0 - bad
  keywords: [String],

  isAnalysed: {
    type: Boolean,
    default: false
  },

  time: Date,
  postId: String,
  link: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}));
