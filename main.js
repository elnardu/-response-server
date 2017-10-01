var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
  path = require('path'),
	http = require('http').Server(app),
	cors = require('cors'),
	ScrapersManager = require('./scrapers/ScrapersManager'),
	AnalysisManager = require('./analysis/AnalysisManager')

var config = require("./config")
require('dotenv').config()


var apiRouter = require('./routes/api'),
  pollRouter = require('./routes/polls')
//   imagesRouter = require('./routes/images'),
//   messagesRouter = require('./routes/messages'),
// 	userRouter = require('./routes/user');


// var staticPath = path.resolve(__dirname, '..', 'client', 'dist');

mongoose.Promise = global.Promise; //tell mongoose to use default promises
mongoose.connect(config.database);


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors())

app.use('/api', apiRouter)
app.use('/polls', pollRouter)

// app.use(express.static(staticPath));
// app.use('/auth', authRouter);
// app.use('/api/post', postRouter);
// app.use('/api/messages', messagesRouter);
// app.use('/api/user', userRouter);
// app.use('/images', imagesRouter);

const scrapersManager = new ScrapersManager(config.settings)

const analysisManager = new AnalysisManager()
setInterval(() => {
	scrapersManager.run()
	analysisManager.run()
}, 60000)

app.get('/status', (req, res) => {
	res.json(config.settings)
})

http.listen(config.port, () => {
	console.log("Listening on port " + config.port)
})
