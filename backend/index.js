const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config/config');

global.User = require('./api/models/userModel')

const routes = require('./api/routes')

mongoose.Promise = global.Promise
mongoose.connect(
  config.DB,
);

const port = config.APP_PORT
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

routes(app)
app.listen(port)

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` })
});

console.log(`Server started on port ${port}`)