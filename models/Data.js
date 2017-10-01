const mongoose = require('mongoose'),
  axiox = require('axios'),
  Schema = mongoose.Schema

let DataScheme = new Schema({
  // image: {
  //   data: Buffer,
  //   contentType: String
  // },
  imageurl: String,
  text: String,

  persons: [Schema.Types.ObjectId],
  location: {
    type: String,
    coordinates: [Number]
  },
  source: String, // name of social network

  sentiment: Number, 
  keywords: [String],

  isAnalysed: {
    type: Boolean,
    default: false
  },

  time: Date,
  postId: {
    type: String,
    unique: true
  },
  link: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

// DataScheme.virtual('imageurl').set(function(v) {
//   console.log('IMAGE', v, this.postId)
//   if (!v) return
//   axiox.get(v, {responseType: 'arraybuffer'})
//   .then(response => {
//     this.image = new Buffer(response.data, 'binary')
//     this.save()
//   })
// })

module.exports = mongoose.model('Data', DataScheme)
