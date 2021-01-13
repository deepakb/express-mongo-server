require('./models/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const requireAuth = require('./middleware/requireAuth');

const app = express();
app.use(bodyParser.json());
app.use(userRoutes);

const mongoURL = '';
const mongoCloudConnectionSetting = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

if (!mongoURL) {
  throw new Error('Please configure correct Mongo URL to connect');
}

mongoose.connect(mongoURL, mongoCloudConnectionSetting);
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to mongo: ' + err);
});

app.get('/', requireAuth, (req, res) => {
  res.send('Hello there!');
});

app.listen(3000, () => {
  console.log('Express server running on port 3000');
});
