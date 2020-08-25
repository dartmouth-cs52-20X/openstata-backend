import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import mainRouter from './routers/main_router';
import parseRouter from './routers/parse_router';

// initialize
const app = express();

// additional init stuff should go before hitting the routing
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/platform_db';

// copied from a private project I'm a part of
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error',
};
// Connect the database
mongoose.connect(mongoURI, mongooseOptions).then(() => {
  mongoose.Promise = global.Promise; // configures mongoose to use ES6 Promises
  mongoose.set('useFindAndModify', false);
  console.log('Connected to Database');
  console.log(mongoURI);
}).catch((err) => {
  console.log('Not Connected to Database ERROR!  ', err);
});

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', mainRouter);
app.use('/api/parse', parseRouter);

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
