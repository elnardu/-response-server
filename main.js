var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
  path = require('path'),
	http = require('http').Server(app),
	ScrapersManager = require('./scrapers/ScrapersManager')

var config = require("./config");

// var authRouter = require('./routes/auth'),
//   postRouter = require('./routes/post'),
//   imagesRouter = require('./routes/images'),
//   messagesRouter = require('./routes/messages'),
// 	userRouter = require('./routes/user');


// var staticPath = path.resolve(__dirname, '..', 'client', 'dist');

mongoose.Promise = global.Promise; //tell mongoose to use default promises
mongoose.connect(config.database);


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// app.use(express.static(staticPath));
// app.use('/auth', authRouter);
// app.use('/api/post', postRouter);
// app.use('/api/messages', messagesRouter);
// app.use('/api/user', userRouter);
// app.use('/images', imagesRouter);

http.listen(config.port, () => {
	console.log("Listening on port " + config.port);
});
