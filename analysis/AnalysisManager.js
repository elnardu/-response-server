const Data = require('../models/Data'),
  TextAnalysis = require('./TextAnalysis')

class AnalysisManager {
  constructor() {
    this.textAnalysis = new TextAnalysis()
  }
  run() {
    // Data.aggregate([
    //   {
    //     $match: {
    //       isAnalysed: false
    //     }
    //   },
    //
    // ])

    Data.find({
      isAnalysed: false
    }).then(data => {
      let c = 0
      let chunk = []
      data.forEach((e) => {
        chunk.push(e)
        c++
        if (c == 40) this.textAnalysis.run(chunk)
      })
      this.textAnalysis.run(chunk)
    })
  }
}

module.exports = AnalysisManager
